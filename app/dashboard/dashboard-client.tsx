"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlashcardSetCard } from "@/components/flashcard-set-card"
import { CreateFlashcardDialog } from "@/components/create-flashcard-dialog"
import { TextInputForm } from "@/components/text-input-form"
import { FlashcardPreview } from "@/components/flashcard-preview"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlashcardService } from "@/lib/flashcard-service"
import { createClient } from "@/lib/client"
import type { FlashcardSet } from "@/lib/types"
import { BookOpen, Plus, FileText, TrendingUp } from "lucide-react"

interface DashboardClientProps {
  initialFlashcardSets: (FlashcardSet & { flashcards?: { count: number }[] })[]
}

export function DashboardClient({ initialFlashcardSets }: DashboardClientProps) {
  const [flashcardSets, setFlashcardSets] = useState(initialFlashcardSets)
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Array<{ front: string; back: string }>>([])
  const [generatedTitle, setGeneratedTitle] = useState("")
  const [activeTab, setActiveTab] = useState("sets")
  const router = useRouter()

  const handleSetCreated = (setId: string) => {
    router.push(`/edit/${setId}`)
  }

  const handleStudy = (setId: string) => {
    router.push(`/study/${setId}`)
  }

  const handleEdit = (setId: string) => {
    router.push(`/edit/${setId}`)
  }

  const handleDelete = async (setId: string) => {
    try {
      const supabase = createClient()
      const flashcardService = new FlashcardService(supabase)
      await flashcardService.deleteFlashcardSet(setId)
      setFlashcardSets((prev) => prev.filter((set) => set.id !== setId))
    } catch (error) {
      console.error("Failed to delete flashcard set:", error)
    }
  }

  const handleFlashcardsGenerated = (flashcards: Array<{ front: string; back: string }>) => {
    setGeneratedFlashcards(flashcards)
    setActiveTab("preview")
  }

  const handleSaveGeneratedCards = async (flashcards: Array<{ front: string; back: string }>, title: string) => {
    try {
      const supabase = createClient()
      const flashcardService = new FlashcardService(supabase)
      const newSet = await flashcardService.createFlashcardSet(title || "Generated Flashcards")
      await flashcardService.saveFlashcardsToSet(newSet.id, flashcards)

      // Refresh the sets list
      const updatedSets = await flashcardService.getFlashcardSets()
      setFlashcardSets(updatedSets)

      setGeneratedFlashcards([])
      setActiveTab("sets")
      router.push(`/study/${newSet.id}`)
    } catch (error) {
      console.error("Failed to save flashcards:", error)
    }
  }

  const handleEditGeneratedCards = (flashcards: Array<{ front: string; back: string }>) => {
    setGeneratedFlashcards(flashcards)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Flashcard Dashboard</h1>
          <p className="text-muted-foreground">Create, manage, and study your flashcard sets</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/progress")}>
          <TrendingUp className="mr-2 h-4 w-4" />
          View Progress
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sets" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Sets
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate from Text
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2" disabled={generatedFlashcards.length === 0}>
            <Plus className="h-4 w-4" />
            Preview ({generatedFlashcards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Flashcard Sets</h2>
            <CreateFlashcardDialog onSetCreated={handleSetCreated} />
          </div>

          {flashcardSets.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No flashcard sets yet</h3>
              <p className="text-muted-foreground mb-4">Create your first set or generate cards from text</p>
              <div className="flex gap-2 justify-center">
                <CreateFlashcardDialog onSetCreated={handleSetCreated} />
                <Button variant="outline" onClick={() => setActiveTab("generate")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate from Text
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flashcardSets.map((set) => (
                <FlashcardSetCard
                  key={set.id}
                  flashcardSet={set}
                  onStudy={handleStudy}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="generate">
          <TextInputForm onFlashcardsGenerated={handleFlashcardsGenerated} />
        </TabsContent>

        <TabsContent value="preview">
          {generatedFlashcards.length > 0 && (
            <FlashcardPreview
              flashcards={generatedFlashcards}
              onSave={handleSaveGeneratedCards}
              onEdit={handleEditGeneratedCards}
              title={generatedTitle}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
