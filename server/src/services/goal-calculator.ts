type DefaultMacros = { calories: number; protein: number; fat: number; carbs: number }

export class GoalCalculator {
  static calculateFromDefaults(defaults: DefaultMacros, opts?: { delta?: number | null }) {
    const delta = opts?.delta ?? 0
    const calories = Math.max(1200, Math.round(defaults.calories + delta * 100))
    return {
      calories,
      proteinPct: defaults.protein,
      fatPct: defaults.fat,
      carbsPct: defaults.carbs,
    }
  }
}


