export interface FlashcardSet {
  id: string
  title: string
  description?: string
  user_id: string
  created_at: string
  updated_at: string
  flashcards?: Flashcard[]
}

export interface Flashcard {
  id: string
  set_id: string
  front_text: string
  back_text: string
  position: number
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  set_id: string
  user_id: string
  cards_studied: number
  cards_correct: number
  session_duration: number
  completed_at: string
}
