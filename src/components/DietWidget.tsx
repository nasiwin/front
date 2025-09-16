import React from 'react'
import { Card } from "./ui/card"
import { useEffect, useState } from "react"
import { DietSelectionModal } from "./DietSelectionModal"
import { fetchCurrentDiet, type CurrentDiet } from "../api/diets"

export function DietWidget() {
  const [showDietSelection, setShowDietSelection] = useState(false)
  const [current, setCurrent] = useState<CurrentDiet | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = () => {
    setError(null)
    fetchCurrentDiet()
      .then(setCurrent)
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
  }

  useEffect(() => {
    reload()
  }, [])

  // Обновляем после закрытия модалки
  useEffect(() => {
    if (!showDietSelection) {
      reload()
    }
  }, [showDietSelection])

  const title = current?.diet?.name || 'Диета не выбрана'
  const goal = current?.goal?.goalWeightDelta != null ? `Цель: ${current.goal.goalWeightDelta} кг` : 'Цель не задана'
  const emoji = current?.diet?.emoji || '🥗'

  return (
    <>
      <Card 
        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowDietSelection(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Текущая диета</h3>
            <p className="text-lg font-medium text-blue-600 mt-1">{title}</p>
            <p className="text-sm text-gray-600 mt-1">{goal}</p>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">{emoji}</span>
          </div>
        </div>
      </Card>

      <DietSelectionModal 
        open={showDietSelection}
        onOpenChange={setShowDietSelection}
      />
    </>
  )
}