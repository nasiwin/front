import { apiGet, apiPut } from './client'

export type DietSummary = {
  id: string
  slug: string
  name: string
  shortDescription: string
  benefits: string[]
  emoji: string
  accentColor: string
  isPopular: boolean
  isCurrent?: boolean
}

export type CurrentDiet = {
  diet: DietSummary | null
  goal: {
    goalWeightDelta: number | null
    startedAt: string | null
    expiresAt: string | null
    adherenceScore: number | null
    calories?: number
    proteinPct?: number
    fatPct?: number
    carbsPct?: number
  } | null
}

export function fetchDiets() {
  return apiGet<DietSummary[]>('/api/diets')
}

export function fetchCurrentDiet() {
  return apiGet<CurrentDiet>('/api/users/me/diet')
}

export function switchDiet(dietId: string, goalWeightDelta?: number | null, goalNotes?: string | null) {
  return apiPut<CurrentDiet, { dietId: string; goalWeightDelta?: number | null; goalNotes?: string | null }>(
    '/api/users/me/diet',
    { dietId, goalWeightDelta: goalWeightDelta ?? null, goalNotes: goalNotes ?? null },
  )
}


