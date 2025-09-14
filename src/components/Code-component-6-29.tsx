import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { RefreshCw, Heart, Zap, Shield, Leaf } from "lucide-react"
import { useState } from "react"

interface Dish {
  id: number
  name: string
  category: "protein" | "fats" | "carbs" | "fiber"
  calories: number
  amount: number
  benefits: string[]
  description: string
  nutritionScore: number
}

const dishesData: Dish[] = [
  // Белки
  {
    id: 1,
    name: "Куриная грудка гриль",
    category: "protein",
    calories: 165,
    amount: 12,
    benefits: ["Высокое содержание белка", "Низкое содержание жира", "Поддержка мышечной массы"],
    description: "Идеальный источник легкоусвояемого белка для поддержания и роста мышечной ткани.",
    nutritionScore: 95
  },
  {
    id: 2,
    name: "Лосось запеченный",
    category: "protein",
    calories: 206,
    amount: 15,
    benefits: ["Омега-3 жирные кислоты", "Высококачественн��й белок", "Поддержка сердца"],
    description: "Богат омега-3 кислотами, которые важны для здоровья сердца и мозга.",
    nutritionScore: 98
  },
  // Жиры
  {
    id: 3,
    name: "Авокадо",
    category: "fats",
    calories: 160,
    amount: 8,
    benefits: ["Мононенасыщенные жиры", "Витамин E", "Поддержка кожи"],
    description: "Источник здоровых жиров, которые помогают усвоению витаминов.",
    nutritionScore: 92
  },
  {
    id: 4,
    name: "Оливковое масло Extra Virgin",
    category: "fats",
    calories: 119,
    amount: 6,
    benefits: ["Антиоксиданты", "Противовоспалительные свойства", "Поддержка иммунитета"],
    description: "Натуральное масло первого отжима с высоким содержанием полезных веществ.",
    nutritionScore: 89
  },
  // Углеводы
  {
    id: 5,
    name: "Киноа отварная",
    category: "carbs",
    calories: 143,
    amount: 48,
    benefits: ["Полноценный белок", "Сложные углеводы", "Медленная энергия"],
    description: "Псевдозлак с полным набором аминокислот и устойчивой энергией.",
    nutritionScore: 94
  },
  {
    id: 6,
    name: "Бурый рис",
    category: "carbs",
    calories: 112,
    amount: 40,
    benefits: ["Клетчатка", "Витамины группы B", "Долгое насыщение"],
    description: "Цельное зерно, богатое питательными веществами и клетчаткой.",
    nutritionScore: 87
  },
  // Клетчатка
  {
    id: 7,
    name: "Брокколи на пару",
    category: "fiber",
    calories: 34,
    amount: 6,
    benefits: ["Витамин C", "Фолиевая кислота", "Антиоксиданты"],
    description: "Суперфуд с высоким содержанием витаминов и минералов.",
    nutritionScore: 96
  },
  {
    id: 8,
    name: "Шпинат свежий",
    category: "fiber",
    calories: 23,
    amount: 4,
    benefits: ["Железо", "Витамин K", "Магний"],
    description: "Листовая зелень, богатая железом и витаминами.",
    nutritionScore: 91
  }
]

interface MenuDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categoryNames = {
  protein: "Белки",
  fats: "Жиры", 
  carbs: "Углеводы",
  fiber: "Клетчатка"
}

const categoryColors = {
  protein: "from-blue-400 to-blue-600",
  fats: "from-orange-400 to-orange-600",
  carbs: "from-green-400 to-green-600",
  fiber: "from-purple-400 to-purple-600"
}

const categoryIcons = {
  protein: <Zap className="w-5 h-5" />,
  fats: <Heart className="w-5 h-5" />,
  carbs: <Shield className="w-5 h-5" />,
  fiber: <Leaf className="w-5 h-5" />
}

export function MenuDetailModal({ open, onOpenChange }: MenuDetailModalProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshMenu = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      alert("Меню обновлено с учетом ваших предпочтений!")
    }, 2000)
  }

  const groupedDishes = dishesData.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = []
    }
    acc[dish.category].push(dish)
    return acc
  }, {} as Record<string, Dish[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Подробное меню</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Кнопка обновления меню */}
          <Button 
            onClick={handleRefreshMenu}
            disabled={isRefreshing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Обновление..." : "Обновить меню"}
          </Button>

          {/* Категории блюд */}
          {Object.entries(groupedDishes).map(([category, dishes]) => (
            <div key={category}>
              <div className={`p-3 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} rounded-lg mb-3`}>
                <div className="flex items-center gap-2 text-white">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                  <h3 className="font-medium">{categoryNames[category as keyof typeof categoryNames]}</h3>
                </div>
              </div>
              
              <div className="space-y-3">
                {dishes.map((dish) => (
                  <Card key={dish.id} className="p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{dish.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{dish.description}</p>
                      </div>
                      <div className="text-right ml-3">
                        <p className="font-medium text-gray-900">{dish.calories} ккал</p>
                        <p className="text-sm text-gray-600">{dish.amount}г</p>
                      </div>
                    </div>
                    
                    {/* Оценка полезности */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Полезность для диеты</span>
                        <span className="text-sm font-medium text-green-600">{dish.nutritionScore}%</span>
                      </div>
                      <Progress value={dish.nutritionScore} className="h-2" />
                    </div>
                    
                    {/* Преимущества */}
                    <div className="space-y-1">
                      {dish.benefits.map((benefit, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="text-xs mr-1 mb-1 bg-green-100 text-green-700 border-green-200"
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}