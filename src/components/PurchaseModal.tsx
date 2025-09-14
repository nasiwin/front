import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { CreditCard, Shield, Star } from "lucide-react"
import { useState } from "react"

interface PurchaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: {
    id: string
    name: string
    duration: string
    price: number
    originalPrice?: number
    color: string
    icon: React.ReactNode
  }
  onClose: () => void
}

export function PurchaseModal({ open, onOpenChange, plan, onClose }: PurchaseModalProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async () => {
    setIsProcessing(true)
    // Имитация обработки платежа
    setTimeout(() => {
      setIsProcessing(false)
      alert("Подписка успешно оформлена!")
      onClose()
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Оформление подписки</DialogTitle>
          <DialogDescription className="text-center">
            Введите данные карты для оформления подписки {plan.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* План подписки */}
          <Card className={`p-4 border-0 bg-gradient-to-br ${plan.color} text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {plan.icon}
                <div>
                  <h3 className="font-medium">{plan.name}</h3>
                  <p className="text-sm opacity-90">{plan.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{plan.price}₽</p>
                {plan.originalPrice && (
                  <p className="text-sm opacity-70 line-through">{plan.originalPrice}₽</p>
                )}
              </div>
            </div>
          </Card>

          {/* Форма оплаты */}
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium">Данные карты</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardNumber">Номер карты</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiryDate">MM/YY</Label>
                  <Input
                    id="expiryDate"
                    placeholder="12/25"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Информация о безопасности */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Защищённая оплата SSL</span>
          </div>

          {/* Преимущества */}
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Что вы получите:</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Мгновенная активация</li>
              <li>• Отмена в любое время</li>
              <li>• 7 дней гарантии возврата</li>
            </ul>
          </Card>

          {/* Кнопки */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Отмена
            </Button>
            <Button 
              onClick={handlePurchase}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isProcessing || !cardNumber || !expiryDate || !cvv}
            >
              {isProcessing ? "Обработка..." : `Оплатить ${plan.price}₽`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}