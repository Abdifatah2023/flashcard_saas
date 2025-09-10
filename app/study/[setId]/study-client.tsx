"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { StudyCard } from "@/components/study-card"
import { StudyProgress } from "@/components/study-progress"
import { StudyComplete } from "@/components/study-complete"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pause, Play } from "lucide-react"
import type { FlashcardSet } from "@/lib/types"
import { FlashcardService } from "@/lib/flashcard-service"
import { createClient } from "@/lib/client"

interface StudyClientProps {
  flashcardSet: FlashcardSet
}

export function StudyClient({ flashcardSet }: StudyClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const router = useRouter()

  const flashcards = flashcardSet.flashcards || []
  const currentCard = flashcards[currentIndex]

  // Timer effect
  useEffect(() => {
    if (isComplete || isPaused) return

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isComplete, isPaused])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault()
        setShowAnswer(!showAnswer)
      } else if (event.key === "ArrowRight" && showAnswer) {
        handleNext(true)
      } else if (event.key === "ArrowLeft" && showAnswer) {
        handleNext(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showAnswer])

  const saveStudySession = async () => {
    try {
      const supabase = createClient()
      const flashcardService = new FlashcardService(supabase)
      await flashcardService.saveStudySession(flashcardSet.id, correctCount + incorrectCount, correctCount, timeElapsed)
    } catch (error) {
      console.error("Failed to save study session:", error)
    }
  }

  const handleNext = (correct: boolean) => {
    if (correct) {
      setCorrectCount((prev) => prev + 1)
    } else {
      setIncorrectCount((prev) => prev + 1)
    }

    if (currentIndex + 1 >= flashcards.length) {
      setIsComplete(true)
      saveStudySession()
    } else {
      setCurrentIndex((prev) => prev + 1)
      setShowAnswer(false)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setCorrectCount(0)
    setIncorrectCount(0)
    setTimeElapsed(0)
    setIsComplete(false)
    setIsPaused(false)
  }

  const handleGoHome = () => {
    router.push("/dashboard")
  }

  const handleToggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  if (isComplete) {
    return (
      <div className="container mx-auto py-8 px-4">
        <StudyComplete
          totalCards={flashcards.length}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          timeElapsed={timeElapsed}
          onRestart={handleRestart}
          onGoHome={handleGoHome}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleGoHome}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{flashcardSet.title}</h1>
            {flashcardSet.description && <p className="text-muted-foreground">{flashcardSet.description}</p>}
          </div>
        </div>
        <Button variant="outline" onClick={handlePause}>
          {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
          {isPaused ? "Resume" : "Pause"}
        </Button>
      </div>

      {isPaused ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Study Session Paused</h2>
          <p className="text-muted-foreground mb-4">Click Resume to continue studying</p>
          <Button onClick={handlePause}>
            <Play className="mr-2 h-4 w-4" />
            Resume Study Session
          </Button>
        </div>
      ) : (
        <>
          <StudyProgress
            currentIndex={currentIndex}
            totalCards={flashcards.length}
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            timeElapsed={timeElapsed}
          />

          <StudyCard
            flashcard={currentCard}
            currentIndex={currentIndex}
            totalCards={flashcards.length}
            onNext={handleNext}
            showAnswer={showAnswer}
            onToggleAnswer={handleToggleAnswer}
          />

          <div className="text-center text-sm text-muted-foreground">
            <p>Use spacebar to flip cards • Arrow keys to mark correct/incorrect</p>
          </div>
        </>
      )}
    </div>
  )
}
