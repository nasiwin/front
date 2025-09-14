import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { useState } from "react"
import { SubscriptionModal } from "./SubscriptionModal"

export function UserProfileWidget() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  return (
    <>
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-blue-100">
            <AvatarImage src="/api/placeholder/48/48" />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">АН</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Анна Новикова</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-700 border-0 rounded-full px-2 py-0.5 cursor-pointer hover:bg-green-200 transition-colors"
                onClick={() => setShowSubscriptionModal(true)}
              >
                Premium
              </Badge>
              <span className="text-sm text-gray-500">до 15 янв</span>
            </div>
          </div>
        </div>
      </Card>

      <SubscriptionModal 
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
    </>
  )
}