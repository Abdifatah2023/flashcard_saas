export interface GeneratedFlashcard {
  front: string
  back: string
}

export async function generateFlashcardsFromText(text: string, count = 10): Promise<GeneratedFlashcard[]> {
  try {
    const response = await fetch("/api/generate-flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, count }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate flashcards")
    }

    const data = await response.json()
    return data.flashcards
  } catch (error) {
    console.error("Error generating flashcards:", error)
    throw error
  }
}

export function extractKeyConceptsFromText(text: string): string[] {
  // Simple text processing to extract potential concepts
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const concepts: string[] = []

  sentences.forEach((sentence) => {
    // Look for definitions (contains "is", "are", "means", etc.)
    if (sentence.match(/\b(is|are|means|refers to|defined as)\b/i)) {
      concepts.push(sentence.trim())
    }

    // Look for important terms (capitalized words, technical terms)
    const importantTerms = sentence.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g)
    if (importantTerms) {
      concepts.push(...importantTerms)
    }
  })

  return [...new Set(concepts)].slice(0, 20) // Remove duplicates and limit
}

export function splitTextIntoChunks(text: string, maxChunkSize = 2000): string[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const chunks: string[] = []
  let currentChunk = ""

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += (currentChunk ? ". " : "") + sentence
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}
