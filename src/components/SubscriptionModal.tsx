import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Check, Crown, Star, Zap } from "lucide-react"
import { useState } from "react"
import { PurchaseModal } from "./PurchaseModal"

interface SubscriptionPlan {
  id: string
  name: string
  duration: string
  price: number
  originalPrice?: number
  features: string[]
  popular?: boolean
  color: string
  icon: React.ReactNode
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "1month",
    name: "Базовый",
    duration: "1 месяц",
    price: 990,
    features: ["Персональные рекомендации", "Сканер продуктов", "Базовая аналитика"],
    color: "from-blue-400 to-blue-600",
    icon: <Star className="w-6 h-6" />
  },
  {
    id: "3months",
    name: "Популярный",
    duration: "3 месяца",
    price: 2490,
    originalPrice: 2970,
    popular: true,
    features: ["Все функции Базового", "Расширенная аналитика", "Приоритетная поддержка", "Персональный диетолог"],
    color: "from-purple-400 to-purple-600",
    icon: <Crown className="w-6 h-6" />
  },
  {
    id: "6months",
    name: "Премиум",
    duration: "6 месяцев",
    price: 4490,
    originalPrice: 5940,
    features: ["Все функции Популярного", "AI-помощник диетолога", "Индивидуальные планы питания", "Доступ к закрытому сообществу"],
    color: "from-emerald-400 to-emerald-600",
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: "12months",
    name: "Годовой",
    duration: "12 месяцев",
    price: 7990,
    originalPrice: 11880,
    features: ["Все функции Премиум", "Персональный тренер", "Доставка продуктов", "Годовая гарантия результата"],
    color: "from-amber-400 to-orange-600",
    icon: <Crown className="w-6 h-6" />
  }
]

interface SubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [showPurchase, setShowPurchase] = useState(false)

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setShowPurchase(true)
  }

  const closePurchaseModal = () => {
    setShowPurchase(false)
    setSelectedPlan(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Выберите план подписки</DialogTitle>
            <DialogDescription className="text-center">
              Выберите подходящий план подписки для получения персональных рекомендаций
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`p-4 border-0 bg-gradient-to-br ${plan.color} text-white cursor-pointer hover:scale-105 transition-transform relative`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white text-purple-600 border-0">
                    Популярный
                  </Badge>
                )}
                
                <div className="flex items-center justify-between mb-3">
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
                
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {selectedPlan && (
        <PurchaseModal 
          open={showPurchase}
          onOpenChange={setShowPurchase}
          plan={selectedPlan}
          onClose={closePurchaseModal}
        />
      )}
    </>
  )
}