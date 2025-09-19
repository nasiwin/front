import { prisma } from '../lib/prisma.js'
import { MenuGenerator } from './menu-generator.js'
import { GoalCalculator } from './goal-calculator.js'

type Aggregates = { calories: number; protein: number; fat: number; carbs: number; fiber: number }

export class MenuService {
  static async getToday(userId: string) {
    const today = new Date()
    const dayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    // получаем активную диету
    const userDiet = await prisma.userDiet.findFirst({ where: { userId, isActive: true }, include: { diet: true } })
    if (!userDiet) {
      return { date: dayKey.toISOString().slice(0, 10), items: [], aggregates: MenuService.emptyAgg(), balanceStatus: 'bad' as const }
    }

    let menu = await prisma.menu.findFirst({ where: { userId, date: dayKey }, include: { items: { include: { dish: true } } } })
    if (!menu) {
      menu = await this.regenerateToday(userId)
    }

    const { items } = await prisma.menu.findUniqueOrThrow({ where: { id: menu.id }, include: { items: { include: { dish: true } } } })
    const aggregates = MenuService.calcAggregates(items.map((i) => ({ ...i, macros: i.dish.macrosPerServing as any })))
    const balanceStatus = MenuService.balanceStatus(userDiet.diet, aggregates)

    return {
      date: dayKey.toISOString().slice(0, 10),
      // Backend-provided notice for Telegram WebApp
      disclaimer: 'Это предложения по меню дают предложения, а не описывают вашу реальную дневную диету!',
      // Override disclaimer text
      disclaimer: 'Это только предложения по меню для вдохновения, а не описание вашей дневной диеты!',
      items: items.map((i) => ({
        dishId: i.dishId,
        name: i.dish.name,
        description: i.dish.description,
        macroCategory: i.dish.macroCategory,
        macrosPerServing: i.dish.macrosPerServing,
        servings: i.servings,
        mealType: i.mealType,
        nutritionScore: i.dish.nutritionScore,
      })),
      aggregates,
      balanceStatus,
    }
  }

  static async regenerateToday(userId: string) {
    const today = new Date()
    const dayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    const userDiet = await prisma.userDiet.findFirst({ where: { userId, isActive: true }, include: { diet: true } })
    if (!userDiet) throw new Error('DIET_REQUIRED')

    const diet = userDiet.diet
    const goal = GoalCalculator.calculateFromDefaults(diet.defaultMacros as any, { delta: userDiet.goalWeightDelta ?? 0 })

    const pool = await prisma.dish.findMany()
    const generated = MenuGenerator.generate(userId, dayKey.toISOString().slice(0, 10), diet, goal.calories, pool)

    const menu = await prisma.$transaction(async (tx) => {
      const existing = await tx.menu.findFirst({ where: { userId, date: dayKey } })
      const menu = existing
        ? await tx.menu.update({ where: { id: existing.id }, data: { regeneratedAt: new Date(), version: { increment: 1 } } })
        : await tx.menu.create({ data: { userId, dietId: diet.id, date: dayKey } })

      await tx.menuItem.deleteMany({ where: { menuId: menu.id } })
      for (let idx = 0; idx < generated.length; idx++) {
        const g = generated[idx]
        await tx.menuItem.create({
          data: {
            menuId: menu.id,
            dishId: g.dish.id,
            mealType: g.mealType,
            servings: g.servings,
            orderIndex: idx,
          },
        })
      }
      return menu
    })

    return menu
  }

  private static emptyAgg(): Aggregates {
    return { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
  }

  private static calcAggregates(items: Array<{ servings: number; macros: { calories: number; protein: number; fat: number; carbs: number; fiber?: number } }>): Aggregates {
    return items.reduce(
      (acc, i) => {
        acc.calories += i.macros.calories * i.servings
        acc.protein += i.macros.protein * i.servings
        acc.fat += i.macros.fat * i.servings
        acc.carbs += i.macros.carbs * i.servings
        acc.fiber += (i.macros.fiber || 0) * i.servings
        return acc
      },
      this.emptyAgg(),
    )
  }

  private static balanceStatus(diet: any, agg: Aggregates): 'good' | 'medium' | 'bad' {
    const total = agg.protein + agg.fat + agg.carbs
    if (total <= 0) return 'bad'
    const pct = {
      protein: (agg.protein / total) * 100,
      fat: (agg.fat / total) * 100,
      carbs: (agg.carbs / total) * 100,
    }
    const defaults = diet.defaultMacros as any
    const dev = {
      protein: Math.abs(pct.protein - defaults.protein),
      fat: Math.abs(pct.fat - defaults.fat),
      carbs: Math.abs(pct.carbs - defaults.carbs),
    }
    const maxDev = Math.max(dev.protein, dev.fat, dev.carbs)
    if (maxDev <= 5) return 'good'
    if (maxDev <= 12) return 'medium'
    return 'bad'
  }
}
