"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface StudyProgressProps {
  currentIndex: number
  totalCards: number
  correctCount: number
  incorrectCount: number
  timeElapsed: number
}

export function StudyProgress({
  currentIndex,
  totalCards,
  correctCount,
  incorrectCount,
  timeElapsed,
}: StudyProgressProps) {
  const progressPercentage = (currentIndex / totalCards) * 100
  const accuracy = currentIndex > 0 ? (correctCount / currentIndex) * 100 : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span className="text-muted-foreground">
            {currentIndex} / {totalCards} cards
          </span>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Correct</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{correctCount}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Incorrect</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
          </div>
        </div>

        {currentIndex > 0 && (
          <div className="text-center pt-2 border-t">
            <span className="text-sm text-muted-foreground">
              Accuracy: <span className="font-medium">{accuracy.toFixed(1)}%</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
