"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedFlashcardProps {
  front: string
  back: string
  className?: string
  delay?: number
}

export function AnimatedFlashcard({ front, back, className, delay = 0 }: AnimatedFlashcardProps) {
  return (
    <div className={cn("relative w-32 h-20 animate-float", className)} style={{ animationDelay: `${delay}s` }}>
      <Card className="absolute inset-0 bg-card/80 backdrop-blur-sm border-2 border-accent/20 shadow-lg animate-flip flex items-center justify-center p-2">
        <span className="text-xs font-medium text-card-foreground text-center leading-tight">{front}</span>
      </Card>
    </div>
  )
}
