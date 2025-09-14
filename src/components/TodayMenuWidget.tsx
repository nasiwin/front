import React from 'react'
import { Card } from "./ui/card"
import { Progress } from "./ui/progress"
import { useState } from "react"
import { MenuDetailModal } from "./MenuDetailModal"

const menuItems = [
  {
    id: 1,
    name: "Куриная грудка гриль",
    time: "Белки",
    calories: 165,
    protein: 31,
    fats: 3.6,
    carbs: 0,
    fiber: 0,
    category: "protein"
  },
  {
    id: 2,
    name: "Авокадо",
    time: "Жиры",
    calories: 160,
    protein: 2,
    fats: 15,
    carbs: 9,
    fiber: 7,
    category: "fats"
  },
  {
    id: 3,
    name: "Киноа отварная",
    time: "Углеводы",
    calories: 143,
    protein: 4.4,
    fats: 1.9,
    carbs: 22,
    fiber: 2.8,
    category: "carbs"
  },
  {
    id: 4,
    name: "Брокколи на пару",
    time: "Клетчатка",
    calories: 34,
    protein: 2.8,
    fats: 0.4,
    carbs: 7,
    fiber: 2.6,
    category: "fiber"
  }
]

const categoryColors = {
  protein: "bg-blue-50 border-blue-200",
  fats: "bg-orange-50 border-orange-200",
  carbs: "bg-green-50 border-green-200",
  fiber: "bg-purple-50 border-purple-200"
}

export function TodayMenuWidget() {
  const [showMenuDetail, setShowMenuDetail] = useState(false)

  return (
    <>
      <Card 
        className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowMenuDetail(true)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Меню на сегодня</h3>
          <span className="text-sm text-gray-500">12 сент</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {menuItems.map((item) => (
            <div key={item.id} className={`flex flex-col gap-1 p-2 rounded-lg border ${categoryColors[item.category as keyof typeof categoryColors]}`}>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col mb-1">
                  <h4 className="text-xs font-medium text-gray-900 truncate">{item.name}</h4>
                  <span className="text-xs text-gray-500">{item.calories} ккал</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-blue-600 font-medium">Б: {item.protein}г</span>
                  <span className="text-orange-600 font-medium">Ж: {item.fats}г</span>
                  <span className="text-green-600 font-medium">У: {item.carbs}г</span>
                  <span className="text-purple-600 font-medium">К: {item.fiber}г</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <MenuDetailModal 
        open={showMenuDetail}
        onOpenChange={setShowMenuDetail}
      />
    </>
  )
}