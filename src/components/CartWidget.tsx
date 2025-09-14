import React from 'react'
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { CartModal } from "./CartModal"

export function CartWidget() {
  const [showCartModal, setShowCartModal] = useState(false)
  const cartStatus = "good" // good, medium, bad
  const itemCount = 7
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-700 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "bad":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "good":
        return "Отличный баланс"
      case "medium":
        return "Средний баланс"
      case "bad":
        return "Нужна корректировка"
      default:
        return "Неизвестно"
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return "✅"
      case "medium":
        return "⚠️"
      case "bad":
        return "❌"
      default:
        return "❓"
    }
  }

  return (
    <>
      <Card 
        className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowCartModal(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Корзина</h3>
              <p className="text-sm text-gray-600">{itemCount} товаров</p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge className={`${getStatusColor(cartStatus)} border rounded-full px-3 py-1 text-sm`}>
              <span className="mr-1">{getStatusIcon(cartStatus)}</span>
              {getStatusText(cartStatus)}
            </Badge>
          </div>
        </div>
      </Card>

      <CartModal 
        open={showCartModal}
        onOpenChange={setShowCartModal}
      />
    </>
  )
}