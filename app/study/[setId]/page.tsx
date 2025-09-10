import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { FlashcardService } from "@/lib/flashcard-service"
import { StudyClient } from "./study-client"

interface StudyPageProps {
  params: Promise<{ setId: string }>
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { setId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const flashcardService = new FlashcardService(supabase)
  const flashcardSet = await flashcardService.getFlashcardSet(setId)

  if (!flashcardSet) {
    redirect("/dashboard")
  }

  if (!flashcardSet.flashcards || flashcardSet.flashcards.length === 0) {
    redirect(`/edit/${setId}`)
  }

  return <StudyClient flashcardSet={flashcardSet} />
}
