import React from 'react'
import { Button } from "./ui/button"
import { Scan } from "lucide-react"
import { useState } from "react"
import { ScannerModal } from "./ScannerModal"

export function ScanButton() {
  const [showScannerModal, setShowScannerModal] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button 
          className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 border-0"
          size="lg"
          onClick={() => setShowScannerModal(true)}
        >
          <Scan className="w-8 h-8" />
        </Button>
      </div>

      <ScannerModal 
        open={showScannerModal}
        onOpenChange={setShowScannerModal}
      />
    </>
  )
}