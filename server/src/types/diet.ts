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

export type CurrentDietResponse = {
  diet: DietSummary | null
  goal: {
    goalWeightDelta: number | null
    startedAt: string | null
    expiresAt: string | null
    adherenceScore: number | null
  } | null
}


