"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Edit, Trash2, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface FlashcardPreviewProps {
  flashcards: Array<{ front: string; back: string }>
  onSave: (flashcards: Array<{ front: string; back: string }>, title: string) => void
  onEdit: (flashcards: Array<{ front: string; back: string }>) => void
  title: string
}

export function FlashcardPreview({ flashcards, onSave, onEdit, title }: FlashcardPreviewProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedCards, setEditedCards] = useState(flashcards)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())

  const handleCardFlip = (index: number) => {
    const newFlipped = new Set(flippedCards)
    if (newFlipped.has(index)) {
      newFlipped.delete(index)
    } else {
      newFlipped.add(index)
    }
    setFlippedCards(newFlipped)
  }

  const handleEdit = (index: number, field: "front" | "back", value: string) => {
    const updated = [...editedCards]
    updated[index] = { ...updated[index], [field]: value }
    setEditedCards(updated)
  }

  const handleDelete = (index: number) => {
    const updated = editedCards.filter((_, i) => i !== index)
    setEditedCards(updated)
    onEdit(updated)
  }

  const handleSave = () => {
    onSave(editedCards, title)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Generated Flashcards</h2>
          <p className="text-muted-foreground">{editedCards.length} cards ready for study</p>
        </div>
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save Flashcard Set
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {editedCards.map((card, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
              flippedCards.has(index) ? "bg-secondary" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Card {index + 1}</Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardFlip(index)
                    }}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingIndex(editingIndex === index ? null : index)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(index)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent onClick={() => handleCardFlip(index)} className="space-y-3">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                  {flippedCards.has(index) ? "Answer" : "Question"}
                </CardTitle>
                {editingIndex === index ? (
                  <Textarea
                    value={flippedCards.has(index) ? card.back : card.front}
                    onChange={(e) => handleEdit(index, flippedCards.has(index) ? "back" : "front", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="min-h-[80px]"
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{flippedCards.has(index) ? card.back : card.front}</p>
                )}
              </div>

              {!editingIndex && (
                <p className="text-xs text-muted-foreground text-center">
                  Click to {flippedCards.has(index) ? "see question" : "reveal answer"}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {editedCards.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No flashcards to preview</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
