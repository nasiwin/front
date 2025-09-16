import { prisma } from '../lib/prisma.js'
import { cache } from '../lib/cache.js'
import { events } from '../lib/events.js'
import { GoalCalculator } from './goal-calculator.js'

export class DietService {
  static async listDiets(userId: string) {
    const cacheKey = `diets:v1`
    const diets = (cache.get<typeof prisma.diet.findMany extends (...args: any) => Promise<infer R> ? R : any>(cacheKey))
      ?? (await prisma.diet.findMany({ orderBy: { name: 'asc' } }))
    if (!cache.get(cacheKey)) cache.set(cacheKey, diets)

    const current = await prisma.userDiet.findFirst({ where: { userId, isActive: true }, include: { diet: true } })
    return diets.map((d) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      shortDescription: d.shortDescription,
      benefits: (d.goalExamples as unknown as string[]) ?? [],
      emoji: d.emoji,
      accentColor: d.colorToken,
      isPopular: d.isPopular,
      isCurrent: current?.dietId === d.id,
    }))
  }

  static async getCurrentDiet(userId: string) {
    const current = await prisma.userDiet.findFirst({
      where: { userId, isActive: true },
      include: { diet: true },
    })
    if (!current) return { diet: null, goal: null }
    const d = current.diet
    return {
      diet: {
        id: d.id,
        slug: d.slug,
        name: d.name,
        shortDescription: d.shortDescription,
        benefits: (d.goalExamples as unknown as string[]) ?? [],
        emoji: d.emoji,
        accentColor: d.colorToken,
        isPopular: d.isPopular,
        isCurrent: true,
      },
      goal: {
        goalWeightDelta: current.goalWeightDelta,
        startedAt: current.startedAt.toISOString(),
        expiresAt: current.expiresAt ? current.expiresAt.toISOString() : null,
        adherenceScore: current.adherenceScore,
      },
    }
  }

  static async switchDiet(userId: string, dietId: string, opts: { goalWeightDelta?: number | null; goalNotes?: string | null }) {
    const diet = await prisma.diet.findUnique({ where: { id: dietId } })
    if (!diet) throw new Error('DIET_NOT_FOUND')

    // Ограничение частоты смены (простая версия – не более 1 активной, сохраняем историю)
    const now = new Date()

    return await prisma.$transaction(async (tx) => {
      await tx.userDiet.updateMany({ where: { userId, isActive: true }, data: { isActive: false, expiresAt: now } })

      const goal = GoalCalculator.calculateFromDefaults(diet.defaultMacros as any, { delta: opts.goalWeightDelta ?? 0 })

      const created = await tx.userDiet.create({
        data: {
          userId,
          dietId: diet.id,
          goalWeightDelta: opts.goalWeightDelta ?? null,
          goalNotes: opts.goalNotes ?? null,
          startedAt: now,
          isActive: true,
        },
        include: { diet: true },
      })

      // событие для последующей генерации меню
      events.emit('diet.changed', { userId, dietId: diet.id, startedAt: now.toISOString() })

      // Возврат сводки
      return {
        diet: {
          id: created.diet.id,
          slug: created.diet.slug,
          name: created.diet.name,
          shortDescription: created.diet.shortDescription,
          benefits: (created.diet.goalExamples as unknown as string[]) ?? [],
          emoji: created.diet.emoji,
          accentColor: created.diet.colorToken,
          isPopular: created.diet.isPopular,
          isCurrent: true,
        },
        goal: {
          goalWeightDelta: created.goalWeightDelta,
          startedAt: created.startedAt.toISOString(),
          expiresAt: created.expiresAt ? created.expiresAt.toISOString() : null,
          adherenceScore: created.adherenceScore,
          calories: goal.calories,
          proteinPct: goal.proteinPct,
          fatPct: goal.fatPct,
          carbsPct: goal.carbsPct,
        },
      }
    })
  }

  static async getDietSummary(dietId: string) {
    const diet = await prisma.diet.findUnique({ where: { id: dietId } })
    if (!diet) throw new Error('DIET_NOT_FOUND')
    return {
      id: diet.id,
      slug: diet.slug,
      name: diet.name,
      emoji: diet.emoji,
      principles: diet.longDescription,
      recommended: ['Овощи с низким ГИ', 'Полезные жиры', 'Качественный белок'],
      avoid: ['Сахар', 'Трансжиры', 'Сильно обработанные продукты'],
      dailyMacros: diet.defaultMacros,
    }
  }
}


