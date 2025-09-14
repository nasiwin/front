import React from 'react'
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Plus, RefreshCw } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useState } from "react"

const recommendations = [
  {
    id: 1,
    name: "Авокадо",
    reason: "Добавит полезных жиров",
    price: "120₽",
    category: "жиры",
    image: "https://images.unsplash.com/photo-1670680901600-8b2b1856ce3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBncm9jZXJ5fGVufDF8fHx8MTc1NzY0MjU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    name: "Куриная грудка",
    reason: "Увеличит количество белка",
    price: "280₽",
    category: "белки",
    image: "https://images.unsplash.com/photo-1670680901600-8b2b1856ce3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBncm9jZXJ5fGVufDF8fHx8MTc1NzY0MjU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    name: "Брокколи",
    reason: "Больше клетчатки и витаминов",
    price: "95₽",
    category: "клетчатка",
    image: "https://images.unsplash.com/photo-1670680901600-8b2b1856ce3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBncm9jZXJ5fGVufDF8fHx8MTc1NzY0MjU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 4,
    name: "Овсяные хлопья",
    reason: "Добавит сложных углеводов",
    price: "65₽",
    category: "углеводы",
    image: "https://images.unsplash.com/photo-1670680901600-8b2b1856ce3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBncm9jZXJ5fGVufDF8fHx8MTc1NzY0MjU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case "белки":
      return "bg-blue-100 text-blue-700"
    case "жиры":
      return "bg-orange-100 text-orange-700"
    case "углеводы":
      return "bg-green-100 text-green-700"
    case "клетчатка":
      return "bg-purple-100 text-purple-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export function RecommendationsWidget() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Симулируем загрузку новых рекомендаций
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Рекомендации</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0 rounded-full">
            Баланс диеты
          </Badge>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <ImageWithFallback 
              src={item.image} 
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <span className="font-medium text-gray-900">{item.price}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.reason}</p>
              <Badge className={`${getCategoryColor(item.category)} border-0 rounded-full text-xs px-2 py-0.5`}>
                {item.category}
              </Badge>
            </div>
            <Button 
              size="sm" 
              className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}