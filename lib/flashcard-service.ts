import type { SupabaseClient } from "@supabase/supabase-js"
import type { FlashcardSet, Flashcard } from "@/lib/types"

export class FlashcardService {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  async createFlashcardSet(title: string, description?: string): Promise<FlashcardSet> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error("User not authenticated")

    const { data, error } = await this.supabase
      .from("flashcard_sets")
      .insert({
        title,
        description,
        user_id: user.user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async saveFlashcardsToSet(setId: string, flashcards: Array<{ front: string; back: string }>): Promise<Flashcard[]> {
    // First, delete existing flashcards in the set
    await this.supabase.from("flashcards").delete().eq("set_id", setId)

    // Insert new flashcards
    const flashcardsToInsert = flashcards.map((card, index) => ({
      set_id: setId,
      front_text: card.front,
      back_text: card.back,
      position: index,
    }))

    const { data, error } = await this.supabase.from("flashcards").insert(flashcardsToInsert).select()

    if (error) throw error
    return data
  }

  async getFlashcardSets(): Promise<(FlashcardSet & { flashcards?: { count: number }[] })[]> {
    const { data, error } = await this.supabase
      .from("flashcard_sets")
      .select(`
        *,
        flashcards:flashcards(count)
      `)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getFlashcardSet(setId: string): Promise<FlashcardSet | null> {
    const { data, error } = await this.supabase
      .from("flashcard_sets")
      .select(`
        *,
        flashcards:flashcards(*)
      `)
      .eq("id", setId)
      .single()

    if (error) {
      if (error.code === "PGRST116") return null
      throw error
    }

    // Sort flashcards by position
    if (data.flashcards) {
      data.flashcards.sort((a: Flashcard, b: Flashcard) => a.position - b.position)
    }

    return data
  }

  async updateFlashcardSet(setId: string, updates: Partial<FlashcardSet>): Promise<FlashcardSet> {
    const { data, error } = await this.supabase
      .from("flashcard_sets")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", setId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteFlashcardSet(setId: string): Promise<void> {
    const { error } = await this.supabase.from("flashcard_sets").delete().eq("id", setId)
    if (error) throw error
  }

  async updateFlashcard(cardId: string, updates: Partial<Flashcard>): Promise<Flashcard> {
    const { data, error } = await this.supabase
      .from("flashcards")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cardId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteFlashcard(cardId: string): Promise<void> {
    const { error } = await this.supabase.from("flashcards").delete().eq("id", cardId)
    if (error) throw error
  }

  async saveStudySession(
    setId: string,
    cardsStudied: number,
    cardsCorrect: number,
    sessionDuration: number,
  ): Promise<void> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error("User not authenticated")

    const { error } = await this.supabase.from("study_sessions").insert({
      set_id: setId,
      user_id: user.user.id,
      cards_studied: cardsStudied,
      cards_correct: cardsCorrect,
      session_duration: sessionDuration,
    })

    if (error) throw error
  }

  async getStudyStats(setId?: string): Promise<{
    totalSessions: number
    totalCardsStudied: number
    totalCorrect: number
    averageAccuracy: number
    totalTimeSpent: number
    recentSessions: Array<{
      id: string
      set_id: string
      set_title: string
      cards_studied: number
      cards_correct: number
      session_duration: number
      completed_at: string
      accuracy: number
    }>
  }> {
    let query = this.supabase
      .from("study_sessions")
      .select(`
        *,
        flashcard_sets!inner(title)
      `)
      .order("completed_at", { ascending: false })

    if (setId) {
      query = query.eq("set_id", setId)
    }

    const { data: sessions, error } = await query.limit(10)

    if (error) throw error

    const totalSessions = sessions.length
    const totalCardsStudied = sessions.reduce((sum, session) => sum + session.cards_studied, 0)
    const totalCorrect = sessions.reduce((sum, session) => sum + session.cards_correct, 0)
    const totalTimeSpent = sessions.reduce((sum, session) => sum + session.session_duration, 0)
    const averageAccuracy = totalCardsStudied > 0 ? (totalCorrect / totalCardsStudied) * 100 : 0

    const recentSessions = sessions.map((session) => ({
      id: session.id,
      set_id: session.set_id,
      set_title: session.flashcard_sets.title,
      cards_studied: session.cards_studied,
      cards_correct: session.cards_correct,
      session_duration: session.session_duration,
      completed_at: session.completed_at,
      accuracy: session.cards_studied > 0 ? (session.cards_correct / session.cards_studied) * 100 : 0,
    }))

    return {
      totalSessions,
      totalCardsStudied,
      totalCorrect,
      averageAccuracy,
      totalTimeSpent,
      recentSessions,
    }
  }

  async getProgressOverTime(days = 30): Promise<
    Array<{
      date: string
      sessions: number
      accuracy: number
      timeSpent: number
    }>
  > {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data: sessions, error } = await this.supabase
      .from("study_sessions")
      .select("*")
      .gte("completed_at", startDate.toISOString())
      .order("completed_at", { ascending: true })

    if (error) throw error

    // Group sessions by date
    const dailyStats = new Map<string, { sessions: number; correct: number; total: number; timeSpent: number }>()

    sessions.forEach((session) => {
      const date = new Date(session.completed_at).toISOString().split("T")[0]
      const existing = dailyStats.get(date) || { sessions: 0, correct: 0, total: 0, timeSpent: 0 }

      dailyStats.set(date, {
        sessions: existing.sessions + 1,
        correct: existing.correct + session.cards_correct,
        total: existing.total + session.cards_studied,
        timeSpent: existing.timeSpent + session.session_duration,
      })
    })

    // Convert to array and fill missing dates
    const result = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      const dateStr = date.toISOString().split("T")[0]

      const stats = dailyStats.get(dateStr) || { sessions: 0, correct: 0, total: 0, timeSpent: 0 }
      result.push({
        date: dateStr,
        sessions: stats.sessions,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
        timeSpent: stats.timeSpent,
      })
    }

    return result
  }
}
