import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Trash2, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface CartItem {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  calories: number
  protein: number
  fats: number
  carbs: number
  fiber: number
  image: string
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Куриная грудка",
    category: "Белки",
    price: 450,
    quantity: 2,
    calories: 165,
    protein: 31,
    fats: 3.6,
    carbs: 0,
    fiber: 0,
    image: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJlYXN0fGVufDF8fHx8MTc1NzY4ODI5OXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    name: "Авокадо",
    category: "Жиры",
    price: 250,
    quantity: 1,
    calories: 160,
    protein: 2,
    fats: 15,
    carbs: 9,
    fiber: 7,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvfGVufDF8fHx8MTc1NzY4ODI5OXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    name: "Киноа",
    category: "Углеводы",
    price: 380,
    quantity: 1,
    calories: 143,
    protein: 4.4,
    fats: 1.9,
    carbs: 22,
    fiber: 2.8,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWlub2F8ZW58MXx8fHwxNzU3Njg4Mjk5fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    name: "Брокколи",
    category: "Клетчатка",
    price: 180,
    quantity: 3,
    calories: 34,
    protein: 2.8,
    fats: 0.4,
    carbs: 7,
    fiber: 2.6,
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saXxlbnwxfHx8fDE3NTc2ODgyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 5,
    name: "Лосось",
    category: "Белки",
    price: 890,
    quantity: 1,
    calories: 206,
    protein: 22,
    fats: 12,
    carbs: 0,
    fiber: 0,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb258ZW58MXx8fHwxNzU3Njg4Mjk5fDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
]

interface CartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categoryColors = {
  "Белки": "bg-blue-100 text-blue-700",
  "Жиры": "bg-orange-100 text-orange-700",
  "Углеводы": "bg-green-100 text-green-700",
  "Клетчатка": "bg-purple-100 text-purple-700"
}

export function CartModal({ open, onOpenChange }: CartModalProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalCalories = cartItems.reduce((sum, item) => sum + (item.calories * item.quantity), 0)
  const totalProtein = cartItems.reduce((sum, item) => sum + (item.protein * item.quantity), 0)
  const totalFats = cartItems.reduce((sum, item) => sum + (item.fats * item.quantity), 0)
  const totalCarbs = cartItems.reduce((sum, item) => sum + (item.carbs * item.quantity), 0)
  const totalFiber = cartItems.reduce((sum, item) => sum + (item.fiber * item.quantity), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Корзина ({cartItems.length})</DialogTitle>
          <DialogDescription className="text-center">
            Управляйте товарами в корзине и контролируйте баланс питательных веществ
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Общая информация */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="font-medium text-gray-900">{totalPrice}₽</p>
                <p className="text-sm text-gray-600">Итого</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">{Math.round(totalCalories)} ккал</p>
                <p className="text-sm text-gray-600">Калории</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs">
              <div>
                <p className="font-medium text-blue-600">{Math.round(totalProtein)}г</p>
                <p className="text-gray-500">Белки</p>
              </div>
              <div>
                <p className="font-medium text-orange-600">{Math.round(totalFats)}г</p>
                <p className="text-gray-500">Жиры</p>
              </div>
              <div>
                <p className="font-medium text-green-600">{Math.round(totalCarbs)}г</p>
                <p className="text-gray-500">Углев.</p>
              </div>
              <div>
                <p className="font-medium text-purple-600">{Math.round(totalFiber)}г</p>
                <p className="text-gray-500">Клетч.</p>
              </div>
            </div>
          </Card>

          {/* Товары в корзине */}
          <div className="space-y-3">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 border border-gray-200">
                <div className="flex gap-3">
                  <ImageWithFallback 
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <Badge 
                          className={`${categoryColors[item.category as keyof typeof categoryColors]} text-xs mt-1`}
                          variant="secondary"
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{item.price * item.quantity}₽</p>
                        <p className="text-sm text-gray-500">{item.price}₽/шт</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {cartItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Корзина пуста</p>
              <p className="text-sm mt-1">Добавьте продукты через сканер</p>
            </div>
          )}

          {/* Кнопка оформления заказа */}
          {cartItems.length > 0 && (
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Оформить заказ • {totalPrice}₽
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}