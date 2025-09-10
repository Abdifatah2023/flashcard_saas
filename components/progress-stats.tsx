"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Target, BookOpen } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ProgressStatsProps {
  stats: {
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
  }
}

export function ProgressStats({ stats }: ProgressStatsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600"
    if (accuracy >= 75) return "text-blue-600"
    if (accuracy >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Study sessions completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Studied</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCardsStudied}</div>
            <p className="text-xs text-muted-foreground">{stats.totalCorrect} answered correctly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAccuracyColor(stats.averageAccuracy)}`}>
              {stats.averageAccuracy.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground">Total study time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Study Sessions</CardTitle>
          <CardDescription>Your latest study activity</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentSessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No study sessions yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{session.set_title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{session.cards_studied} cards</span>
                      <span>{formatTime(session.session_duration)}</span>
                      <span>{formatDistanceToNow(new Date(session.completed_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={session.accuracy >= 75 ? "default" : "secondary"}>
                      {session.accuracy.toFixed(1)}% accuracy
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {session.cards_correct}/{session.cards_studied} correct
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
