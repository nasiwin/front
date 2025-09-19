import React from 'react'
import { Card } from "./ui/card"
import { useEffect, useMemo, useState } from "react"
import { MenuDetailModal } from "./MenuDetailModal"
import { fetchMenuToday, regenerateMenuToday, type MenuToday } from "../api/menu"

const categoryColors = {
  protein: "bg-blue-50 border-blue-200",
  fat: "bg-orange-50 border-orange-200",
  carb: "bg-green-50 border-green-200",
  fiber: "bg-purple-50 border-purple-200"
}

// Localized category labels
const categoryLabels: Record<string, string> = {
  protein: "белки",
  fat: "жиры",
  carb: "углеводы",
  fiber: "клетчатка",
}

// Text color classes for categories
const categoryTextColors: Record<string, string> = {
  protein: "text-blue-600",
  fat: "text-orange-600",
  carb: "text-green-600",
  fiber: "text-purple-600",
}

export function TodayMenuWidget() {
  const [showMenuDetail, setShowMenuDetail] = useState(false)
  const [menu, setMenu] = useState<MenuToday | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    fetchMenuToday()
      .then(setMenu)
      .catch((e) => setError(e.message || 'Ошибка загрузки меню'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const dateLabel = useMemo(() => {
    if (!menu?.date) return ''
    try {
      const d = new Date(menu.date)
      return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
    } catch {
      return menu.date
    }
  }, [menu?.date])

  return (
    <>
      <Card 
        className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowMenuDetail(true)}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-gray-900">Меню на сегодня</h3>
          <span className="text-sm text-gray-500">{dateLabel}</span>
        </div>

        {loading && <div className="text-sm text-gray-500">Загрузка...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            {menu?.disclaimer && (
              <p className="text-xs text-gray-500 my-0">{menu.disclaimer}</p>
            )}
            <div className="grid grid-cols-2 gap-2 mt-[-0.25rem]">
            {menu?.items.map((item, idx) => (
              <div
                key={`${item.dishId}-${idx}`}
                className={`flex h-full flex-col gap-1 p-2 rounded-lg border ${categoryColors[item.macroCategory as keyof typeof categoryColors]}`}
              >
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="flex flex-col gap-1">
                    <h4
                      className="text-xs font-medium text-gray-600 truncate self-end text-right"
                      style={{ fontSize: "11.25px" }}
                    >
                      {categoryLabels[item.macroCategory as keyof typeof categoryLabels]}
                    </h4>
                    <span className="self-start text-left w-full text-black text-xs font-medium whitespace-normal break-words leading-tight my-0.5">
                      {item.name}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <div className="grid grid-cols-2 gap-1 text-xs mt-1">
                      <span className="text-blue-600 font-medium">Б: {(item.macrosPerServing.protein * item.servings).toFixed(1)}г</span>
                      <span className="text-orange-600 font-medium">Ж: {(item.macrosPerServing.fat * item.servings).toFixed(1)}г</span>
                      <span className="text-green-600 font-medium">У: {(item.macrosPerServing.carbs * item.servings).toFixed(1)}г</span>
                      <span className="text-purple-600 font-medium">К: {((item.macrosPerServing.fiber || 0) * item.servings).toFixed(1)}г</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </Card>

      <MenuDetailModal 
        open={showMenuDetail}
        onOpenChange={(open) => {
          setShowMenuDetail(open)
          if (!open) load() // при закрытии модалки — обновляем меню (на случай регенерации внутри)
        }}
      />
    </>
  )
}
