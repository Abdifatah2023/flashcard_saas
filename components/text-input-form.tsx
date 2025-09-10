"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FileText, Sparkles } from "lucide-react"
import { generateFlashcardsFromText, extractKeyConceptsFromText } from "@/lib/ai-flashcard-generator"

interface TextInputFormProps {
  onFlashcardsGenerated: (flashcards: Array<{ front: string; back: string }>) => void
}

export function TextInputForm({ onFlashcardsGenerated }: TextInputFormProps) {
  const [text, setText] = useState("")
  const [setTitle, setSetTitle] = useState("")
  const [cardCount, setCardCount] = useState(10)
  const [isGenerating, setIsGenerating] = useState(false)
  const [keyConcepts, setKeyConcepts] = useState<string[]>([])

  const handleTextChange = (value: string) => {
    setText(value)
    if (value.length > 100) {
      const concepts = extractKeyConceptsFromText(value)
      setKeyConcepts(concepts.slice(0, 5)) // Show top 5 concepts
    } else {
      setKeyConcepts([])
    }
  }

  const handleGenerate = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    try {
      const flashcards = await generateFlashcardsFromText(text, cardCount)
      onFlashcardsGenerated(flashcards)
    } catch (error) {
      console.error("Failed to generate flashcards:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        handleTextChange(content)
      }
      reader.readAsText(file)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Flashcards from Text
        </CardTitle>
        <CardDescription>
          Paste your study material or upload a text file to automatically generate flashcards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="set-title">Flashcard Set Title</Label>
          <Input
            id="set-title"
            placeholder="e.g., Biology Chapter 5: Cell Structure"
            value={setTitle}
            onChange={(e) => setSetTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-input">Study Material</Label>
          <Textarea
            id="text-input"
            placeholder="Paste your study material here... (minimum 100 characters for best results)"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-[200px] resize-y"
          />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{text.length} characters</span>
            <div className="flex items-center gap-2">
              <Label htmlFor="file-upload" className="cursor-pointer hover:text-foreground">
                Or upload a text file
              </Label>
              <input id="file-upload" type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
            </div>
          </div>
        </div>

        {keyConcepts.length > 0 && (
          <div className="space-y-2">
            <Label>Key Concepts Detected</Label>
            <div className="flex flex-wrap gap-2">
              {keyConcepts.map((concept, index) => (
                <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                  {concept.length > 30 ? concept.substring(0, 30) + "..." : concept}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <Label htmlFor="card-count">Number of Cards</Label>
            <Input
              id="card-count"
              type="number"
              min="1"
              max="50"
              value={cardCount}
              onChange={(e) => setCardCount(Number.parseInt(e.target.value) || 10)}
              className="w-20"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!text.trim() || isGenerating || text.length < 50}
            className="ml-auto"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Flashcards
              </>
            )}
          </Button>
        </div>

        {text.length > 0 && text.length < 50 && (
          <p className="text-sm text-muted-foreground">
            Please enter at least 50 characters for better flashcard generation.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
