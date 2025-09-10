"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff } from "lucide-react"
import type { Flashcard } from "@/lib/types"

interface StudyCardProps {
  flashcard: Flashcard
  currentIndex: number
  totalCards: number
  onNext: (correct: boolean) => void
  showAnswer: boolean
  onToggleAnswer: () => void
}

export function StudyCard({ flashcard, currentIndex, totalCards, onNext, showAnswer, onToggleAnswer }: StudyCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">
          Card {currentIndex + 1} of {totalCards}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onToggleAnswer}>
          {showAnswer ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </Button>
      </div>

      <Card
        className="min-h-[300px] cursor-pointer transition-all duration-300 hover:shadow-lg"
        onClick={onToggleAnswer}
      >
        <CardContent className="flex items-center justify-center p-8 h-full">
          <div className="text-center space-y-4">
            <div className="text-sm font-medium text-muted-foreground mb-4">{showAnswer ? "Answer" : "Question"}</div>
            <p className="text-lg leading-relaxed text-balance">
              {showAnswer ? flashcard.back_text : flashcard.front_text}
            </p>
            {!showAnswer && (
              <p className="text-sm text-muted-foreground mt-6">Click to reveal answer or use the button above</p>
            )}
          </div>
        </CardContent>
      </Card>

      {showAnswer && (
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNext(false)}
            className="flex-1 max-w-xs border-red-200 text-red-700 hover:bg-red-50"
          >
            Incorrect
          </Button>
          <Button size="lg" onClick={() => onNext(true)} className="flex-1 max-w-xs bg-green-600 hover:bg-green-700">
            Correct
          </Button>
        </div>
      )}

      {!showAnswer && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Review the question, then reveal the answer to continue</p>
        </div>
      )}
    </div>
  )
}
