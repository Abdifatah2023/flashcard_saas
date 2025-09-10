import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { FlashcardService } from "@/lib/flashcard-service"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()

  console.log("[v0] Supabase client created:", !!supabase)
  console.log("[v0] Supabase client has from method:", typeof supabase?.from)
  console.log("[v0] Environment variables:", {
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  console.log("[v0] User authenticated:", !!data.user)

  const flashcardService = new FlashcardService(supabase)
  console.log("[v0] FlashcardService created, about to call getFlashcardSets")

  const flashcardSets = await flashcardService.getFlashcardSets()
  console.log("[v0] FlashcardSets retrieved:", flashcardSets?.length || 0)

  return <DashboardClient initialFlashcardSets={flashcardSets} />
}
