import { apiGet, apiPost } from './client'

export type MenuItem = {
  dishId: string
  name: string
  description: string
  macroCategory: 'protein' | 'fat' | 'carb' | 'fiber'
  macrosPerServing: { calories: number; protein: number; fat: number; carbs: number; fiber?: number }
  servings: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  nutritionScore: number
}

export type MenuToday = {
  date: string
  items: MenuItem[]
  aggregates: { calories: number; protein: number; fat: number; carbs: number; fiber: number }
  balanceStatus: 'good' | 'medium' | 'bad'
  disclaimer?: string
}

export function fetchMenuToday() {
  return apiGet<MenuToday>('/api/menu/today')
}

export function regenerateMenuToday() {
  return apiPost<MenuToday>('/api/menu/today/regenerate', {})
}


