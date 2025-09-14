import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Camera, X, Flashlight, RotateCcw, Info } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface ScannedProduct {
  name: string
  brand: string
  calories: number
  protein: number
  fats: number
  carbs: number
  fiber: number
  price: number
  category: string
  healthScore: number
  recommendations: string[]
}

interface ScannerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScannerModal({ open, onOpenChange }: ScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null)
  const [flashOn, setFlashOn] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Симуляция сканирования
  const mockProducts: ScannedProduct[] = [
    {
      name: "Греческий йогурт",
      brand: "Danone",
      calories: 102,
      protein: 10,
      fats: 5,
      carbs: 6,
      fiber: 0,
      price: 89,
      category: "Белки",
      healthScore: 85,
      recommendations: [
        "Отличный источник белка",
        "Хорошо сочетается с ягодами",
        "Подходит для вашей диеты"
      ]
    },
    {
      name: "Овсяные хлопья",
      brand: "Myllyn Paras",
      calories: 380,
      protein: 13,
      fats: 6,
      carbs: 66,
      fiber: 10,
      price: 125,
      category: "Углеводы",
      healthScore: 92,
      recommendations: [
        "Богаты клетчаткой",
        "Медленные углеводы",
        "Идеально для завтрака"
      ]
    }
  ]

  const startScanning = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsScanning(true)
      
      // Симуляция сканирования через 3 секунды
      setTimeout(() => {
        const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)]
        setScannedProduct(randomProduct)
        setIsScanning(false)
        stopScanning()
      }, 3000)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Не удалось получить доступ к камере')
    }
  }

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const resetScanner = () => {
    setScannedProduct(null)
    setIsScanning(false)
    stopScanning()
  }

  const addToCart = () => {
    if (scannedProduct) {
      alert(`${scannedProduct.name} добавлен в корзину!`)
      onOpenChange(false)
      resetScanner()
    }
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  const categoryColors = {
    "Белки": "bg-blue-100 text-blue-700",
    "Жиры": "bg-orange-100 text-orange-700", 
    "Углеводы": "bg-green-100 text-green-700",
    "Клетчатка": "bg-purple-100 text-purple-700"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Заголовок */}
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-center">Сканер продуктов</DialogTitle>
            <DialogDescription className="text-center">
              Сканируйте штрих-код пр��дукта для получения информации о составе
            </DialogDescription>
          </DialogHeader>

          {!scannedProduct ? (
            <>
              {/* Камера */}
              <div className="relative bg-black aspect-square">
                {isScanning ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4">
                    <Camera className="w-16 h-16 text-gray-400" />
                    <p className="text-center text-gray-300">
                      Наведите камеру на штрих-код продукта
                    </p>
                  </div>
                )}
                
                {/* Сканирующая рамка */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-blue-500 relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                      
                      {/* Анимированная линия сканирования */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 animate-pulse"></div>
                    </div>
                  </div>
                )}

                {/* Кнопки управления камерой */}
                {isScanning && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setFlashOn(!flashOn)}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      <Flashlight className={`w-5 h-5 ${flashOn ? 'text-yellow-500' : ''}`} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={resetScanner}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Информационная панель */}
              <div className="p-4">
                <Card className="p-3 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Как сканировать:</p>
                      <ul className="space-y-1">
                        <li>• Поднесите продукт к камере</li>
                        <li>• Убедитесь, что штрих-код четко виден</li>
                        <li>• Держите устройство неподвижно</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Кнопка начала сканирования */}
                <Button 
                  onClick={startScanning}
                  disabled={isScanning}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isScanning ? "Сканирование..." : "Начать сканирование"}
                </Button>
              </div>
            </>
          ) : (
            /* Результат сканирования */
            <div className="p-4 space-y-4">
              <Card className="p-4 border-2 border-green-200 bg-green-50">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-medium text-green-900">Продукт найден!</h3>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900">{scannedProduct.name}</h4>
                    <p className="text-sm text-gray-600">{scannedProduct.brand}</p>
                    <Badge 
                      className={`${categoryColors[scannedProduct.category as keyof typeof categoryColors]} mt-1`}
                      variant="secondary"
                    >
                      {scannedProduct.category}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{scannedProduct.price}₽</p>
                      <p className="text-gray-600">Цена</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{scannedProduct.calories} ккал</p>
                      <p className="text-gray-600">Калории</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <p className="font-medium text-blue-600">{scannedProduct.protein}г</p>
                      <p className="text-gray-500">Белки</p>
                    </div>
                    <div>
                      <p className="font-medium text-orange-600">{scannedProduct.fats}г</p>
                      <p className="text-gray-500">Жиры</p>
                    </div>
                    <div>
                      <p className="font-medium text-green-600">{scannedProduct.carbs}г</p>
                      <p className="text-gray-500">Углев.</p>
                    </div>
                    <div>
                      <p className="font-medium text-purple-600">{scannedProduct.fiber}г</p>
                      <p className="text-gray-500">Клетч.</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Оценка для диеты</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${scannedProduct.healthScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-green-600">{scannedProduct.healthScore}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Рекомендации:</p>
                    <div className="space-y-1">
                      {scannedProduct.recommendations.map((rec, index) => (
                        <p key={index} className="text-sm text-gray-600 flex items-center gap-1">
                          <span className="text-green-500">•</span>
                          {rec}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={resetScanner}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Сканировать ещё
                </Button>
                <Button 
                  onClick={addToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Добавить в корзину
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}