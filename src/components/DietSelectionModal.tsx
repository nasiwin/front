import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Check } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { fetchDiets, switchDiet, type DietSummary } from "../api/diets"

const colorMap: Record<string, string> = {
  emerald: 'from-green-50 to-emerald-50',
  sky: 'from-sky-50 to-blue-50',
  rose: 'from-rose-50 to-pink-50',
}

interface DietSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DietSelectionModal({ open, onOpenChange }: DietSelectionModalProps) {
  const [list, setList] = useState<DietSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    fetchDiets()
      .then((items) => {
        setList(items)
        const current = items.find((d) => d.isCurrent)
        setSelectedDiet(current?.id ?? null)
      })
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [open])

  const handleDietSelect = async (dietId: string) => {
    try {
      setSelectedDiet(dietId)
      await switchDiet(dietId, null, null)
      onOpenChange(false)
    } catch (e) {
      // небольшая обратная связь
      console.error(e)
      setError('Не удалось применить диету, попробуйте ещё раз')
    }
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
            {loading && (
              <div className="text-sm text-gray-500 text-center">Загрузка...</div>
            )}
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}
            {!loading && !error && list.map((diet) => (
              <Card 
                key={diet.id}
                className={`p-4 cursor-pointer transition-all border-0 bg-gradient-to-r ${colorMap[diet.accentColor] ?? 'from-gray-50 to-gray-100'} ${
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
                      {diet.isCurrent && selectedDiet !== diet.id && (
                        <Badge className="bg-blue-100 text-blue-700 border-0 rounded-full text-xs">
                          Текущая
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{diet.shortDescription}</p>
                    <p className="text-xs text-gray-600">{diet.benefits?.join(', ')}</p>
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