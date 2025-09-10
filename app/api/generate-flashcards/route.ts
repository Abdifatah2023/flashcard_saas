import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, count = 10 } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // For now, we'll use a simple rule-based approach
    // In a real implementation, you'd use an AI service like OpenAI
    const flashcards = generateFlashcardsRuleBased(text, count)

    return NextResponse.json({ flashcards })
  } catch (error) {
    console.error("Error generating flashcards:", error)
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 })
  }
}

function generateFlashcardsRuleBased(text: string, count: number) {
  const flashcards = []
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10)

  // Pattern 1: Definition-based flashcards
  for (const sentence of sentences) {
    const definitionMatch = sentence.match(/(.+?)\s+(is|are|means|refers to|defined as)\s+(.+)/i)
    if (definitionMatch && flashcards.length < count) {
      const [, term, , definition] = definitionMatch
      flashcards.push({
        front: `What ${definitionMatch[2].toLowerCase()} ${term.trim()}?`,
        back: definition.trim(),
      })
    }
  }

  // Pattern 2: Key term flashcards
  const keyTerms = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
  const uniqueTerms = [...new Set(keyTerms)].slice(0, count - flashcards.length)

  for (const term of uniqueTerms) {
    if (flashcards.length >= count) break

    // Find context for the term
    const contextSentence = sentences.find((s) => s.includes(term))
    if (contextSentence) {
      flashcards.push({
        front: `What is ${term}?`,
        back: contextSentence.trim(),
      })
    }
  }

  // Pattern 3: Question-based flashcards from numbered lists or bullet points
  const listItems = text.match(/(?:^\d+\.|^[-•*])\s*(.+?)(?=\n|$)/gm) || []
  for (const item of listItems.slice(0, count - flashcards.length)) {
    if (flashcards.length >= count) break

    const cleanItem = item.replace(/^(?:\d+\.|[-•*])\s*/, "").trim()
    flashcards.push({
      front: `Explain: ${cleanItem.split(" ").slice(0, 5).join(" ")}...`,
      back: cleanItem,
    })
  }

  // Ensure we have at least some flashcards
  if (flashcards.length === 0 && sentences.length > 0) {
    // Create basic flashcards from sentences
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[i].trim()
      flashcards.push({
        front: `Complete this statement: ${sentence.split(" ").slice(0, 3).join(" ")}...`,
        back: sentence,
      })
    }
  }

  return flashcards.slice(0, count)
}
