"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, RotateCcw, Home, CheckCircle, XCircle } from "lucide-react"

interface StudyCompleteProps {
  totalCards: number
  correctCount: number
  incorrectCount: number
  timeElapsed: number
  onRestart: () => void
  onGoHome: () => void
}

export function StudyComplete({
  totalCards,
  correctCount,
  incorrectCount,
  timeElapsed,
  onRestart,
  onGoHome,
}: StudyCompleteProps) {
  const accuracy = (correctCount / totalCards) * 100
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Excellent work!", color: "text-green-600", icon: Trophy }
    if (accuracy >= 75) return { message: "Great job!", color: "text-blue-600", icon: CheckCircle }
    if (accuracy >= 60) return { message: "Good effort!", color: "text-yellow-600", icon: CheckCircle }
    return { message: "Keep practicing!", color: "text-orange-600", icon: RotateCcw }
  }

  const performance = getPerformanceMessage()
  const PerformanceIcon = performance.icon

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <PerformanceIcon className={`h-8 w-8 ${performance.color}`} />
            </div>
          </div>
          <CardTitle className="text-2xl">Study Session Complete!</CardTitle>
          <p className={`text-lg font-medium ${performance.color}`}>{performance.message}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">{accuracy.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Correct</span>
              </div>
              <div className="text-xl font-bold text-green-600">{correctCount}</div>
            </div>

            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Incorrect</span>
              </div>
              <div className="text-xl font-bold text-red-600">{incorrectCount}</div>
            </div>

            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="text-xl font-bold">{totalCards}</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onRestart} className="flex-1 max-w-xs bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              Study Again
            </Button>
            <Button onClick={onGoHome} className="flex-1 max-w-xs">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
