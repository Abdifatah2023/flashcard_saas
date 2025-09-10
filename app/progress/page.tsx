import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { FlashcardService } from "@/lib/flashcard-service"
import { ProgressClient } from "./progress-client"

export default async function ProgressPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const flashcardService = new FlashcardService(supabase)
  const [stats, progressData] = await Promise.all([
    flashcardService.getStudyStats(),
    flashcardService.getProgressOverTime(30),
  ])

  return <ProgressClient initialStats={stats} initialProgressData={progressData} />
}
