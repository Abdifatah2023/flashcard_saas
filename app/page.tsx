import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { LandingHeader } from "@/components/landing-header"
import { AnimatedFlashcard } from "@/components/animated-flashcard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Brain, Zap, Target, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (data?.user) {
    redirect("/dashboard")
  }

  const flashcards = [
    { front: "What is AI?", back: "Artificial Intelligence" },
    { front: "React Hook", back: "useState" },
    { front: "Database", back: "Supabase" },
    { front: "Styling", back: "Tailwind CSS" },
    { front: "Framework", back: "Next.js" },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LandingHeader />

      <div className="absolute inset-0 pointer-events-none">
        <AnimatedFlashcard
          front="Learn Fast"
          back="Study Smart"
          className="absolute top-20 left-10 opacity-20"
          delay={0}
        />
        <AnimatedFlashcard
          front="AI Powered"
          back="Smart Cards"
          className="absolute top-40 right-20 opacity-15"
          delay={1}
        />
        <AnimatedFlashcard
          front="Progress"
          back="Tracking"
          className="absolute bottom-40 left-20 opacity-10"
          delay={2}
        />
        <AnimatedFlashcard
          front="Study Mode"
          back="Focus Time"
          className="absolute bottom-20 right-10 opacity-20"
          delay={3}
        />
        <AnimatedFlashcard
          front="Generate"
          back="From Text"
          className="absolute top-60 left-1/2 opacity-15"
          delay={1.5}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
            Transform Text into
            <span className="text-accent"> Smart Flashcards</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Generate AI-powered flashcards from any text, study with interactive sessions, and track your learning
            progress with our intelligent study platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/auth/sign-up">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          {/* Demo Cards */}
          <div className="flex flex-wrap justify-center gap-4 opacity-80">
            {flashcards.slice(0, 3).map((card, index) => (
              <AnimatedFlashcard
                key={index}
                front={card.front}
                back={card.back}
                className="animate-slide-in"
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About FlashCards AI</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Our intelligent flashcard platform revolutionizes how you study by automatically generating high-quality
              flashcards from any text content using advanced AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
                <p className="text-muted-foreground text-sm">
                  Automatically extract key concepts and create meaningful flashcards from any text
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Study</h3>
                <p className="text-muted-foreground text-sm">
                  Engage with dynamic study sessions featuring card flipping and progress tracking
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Track your learning journey with detailed statistics and performance insights
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Organized Learning</h3>
                <p className="text-muted-foreground text-sm">
                  Create and manage multiple flashcard sets for different subjects and topics
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Supercharge Your Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students who are already studying smarter with AI-powered flashcards.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/auth/sign-up">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
