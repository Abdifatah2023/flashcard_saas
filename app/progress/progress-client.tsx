"use client"

import { ProgressStats } from "@/components/progress-stats"
import { ProgressChart } from "@/components/progress-chart"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProgressClientProps {
  initialStats: any
  initialProgressData: any
}

export function ProgressClient({ initialStats, initialProgressData }: ProgressClientProps) {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Study Progress</h1>
          <p className="text-muted-foreground">Track your learning journey and performance</p>
        </div>
      </div>

      <ProgressStats stats={initialStats} />
      <ProgressChart data={initialProgressData} />
    </div>
  )
}
