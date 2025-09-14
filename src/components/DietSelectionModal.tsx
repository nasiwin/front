import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Check } from "lucide-react"
import { useState } from "react"

const diets = [
  {
    id: 1,
    name: "Средиземноморская",
    description: "Богата овощами, фруктами, рыбой и оливковым маслом",
    benefits: "Для здоровья сердца и долголетия",
    emoji: "🥗",
    color: "from-blue-50 to-indigo-50",
    current: true
  },
  {
    id: 2,
    name: "Кето",
    description: "Высокое содержание жиров, низкое количество углеводов",
    benefits: "Для быстрого снижения веса",
    emoji: "🥑",
    color: "from-green-50 to-emerald-50",
    current: false
  },
  {
    id: 3,
    name: "Веганская",
    description: "Исключительно растительная пища",
    benefits: "Для экологии и здоровья",
    emoji: "🌱",
    color: "from-green-50 to-lime-50",
    current: false
  },
  {
    id: 4,
    name: "Палео",
    description: "Продукты, доступные в эпоху палеолита",
    benefits: "Для натурального питания",
    emoji: "🥩",
    color: "from-orange-50 to-amber-50",
    current: false
  },
  {
    id: 5,
    name: "Интервальное голодание",
    description: "Чередование периодов еды и голодания",
    benefits: "Для метаболизма и контроля веса",
    emoji: "⏰",
    color: "from-purple-50 to-violet-50",
    current: false
  },
  {
    id: 6,
    name: "DASH",
    description: "Диетический подход к остановке гипертонии",
    benefits: "Для снижения давления",
    emoji: "💗",
    color: "from-pink-50 to-rose-50",
    current: false
  }
]

interface DietSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DietSelectionModal({ open, onOpenChange }: DietSelectionModalProps) {
  const [selectedDiet, setSelectedDiet] = useState(1)

  const handleDietSelect = (dietId: number) => {
    setSelectedDiet(dietId)
    // Здесь можно добавить логику сохранения выбранной диеты
    setTimeout(() => {
      onOpenChange(false)
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto p-0 border-0 bg-transparent">
        <div className="bg-white rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-center">Выберите диету</DialogTitle>
            <p className="text-sm text-gray-600 text-center mt-2">
              Мы подберем меню и рекомендации под ваши цели
            </p>
          </DialogHeader>
          
          <div className="space-y-3">
            {diets.map((diet) => (
              <Card 
                key={diet.id}
                className={`p-4 cursor-pointer transition-all border-0 bg-gradient-to-r ${diet.color} ${
                  selectedDiet === diet.id ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'
                }`}
                onClick={() => handleDietSelect(diet.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{diet.emoji}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{diet.name}</h4>
                      {selectedDiet === diet.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {diet.current && selectedDiet !== diet.id && (
                        <Badge className="bg-blue-100 text-blue-700 border-0 rounded-full text-xs">
                          Текущая
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{diet.description}</p>
                    <p className="text-xs text-gray-600">{diet.benefits}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}