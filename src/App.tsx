import React from 'react'
import { UserProfileWidget } from "./components/UserProfileWidget"
import { DietWidget } from "./components/DietWidget"
import { TodayMenuWidget } from "./components/TodayMenuWidget"
import { CartWidget } from "./components/CartWidget"
import { RecommendationsWidget } from "./components/RecommendationsWidget"
import { ScanButton } from "./components/ScanButton"

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-sm mx-auto p-4 pb-24 space-y-4">
        {/* Header with User Profile */}
        <UserProfileWidget />
        
        {/* Diet Selection Widget */}
        <DietWidget />
        
        {/* Today's Menu Widget */}
        <TodayMenuWidget />
        
        {/* Cart Status Widget */}
        <CartWidget />
        
        {/* Recommendations Widget */}
        <RecommendationsWidget />
      </div>
      
      {/* Floating Scan Button */}
      <ScanButton />
    </div>
  )
}