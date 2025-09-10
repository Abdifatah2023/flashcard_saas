"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Play, Edit, Trash2, Calendar } from "lucide-react"
import type { FlashcardSet } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface FlashcardSetCardProps {
  flashcardSet: FlashcardSet & { flashcards?: { count: number }[] }
  onStudy: (setId: string) => void
  onEdit: (setId: string) => void
  onDelete: (setId: string) => void
}

export function FlashcardSetCard({ flashcardSet, onStudy, onEdit, onDelete }: FlashcardSetCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const cardCount = flashcardSet.flashcards?.[0]?.count || 0
  const lastUpdated = formatDistanceToNow(new Date(flashcardSet.updated_at), { addSuffix: true })

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(flashcardSet.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">{flashcardSet.title}</CardTitle>
            {flashcardSet.description && (
              <CardDescription className="line-clamp-2">{flashcardSet.description}</CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStudy(flashcardSet.id)}>
                <Play className="mr-2 h-4 w-4" />
                Study
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(flashcardSet.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{cardCount} cards</Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {lastUpdated}
            </div>
          </div>
          <Button onClick={() => onStudy(flashcardSet.id)} size="sm">
            <Play className="mr-2 h-3 w-3" />
            Study
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
