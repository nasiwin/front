import React from 'react'
import { Card } from "./ui/card"
import { useState } from "react"
import { DietSelectionModal } from "./DietSelectionModal"

export function DietWidget() {
  const [showDietSelection, setShowDietSelection] = useState(false)

  return (
    <>
      <Card 
        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowDietSelection(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Текущая диета</h3>
            <p className="text-lg font-medium text-blue-600 mt-1">Средиземноморская</p>
            <p className="text-sm text-gray-600 mt-1">Цель: -3 кг за месяц</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🥗</span>
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