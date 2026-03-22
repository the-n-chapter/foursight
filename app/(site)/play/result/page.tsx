"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PersonalityFlipCard } from "@/components/personality-flip-card"
import { ResultShare } from "@/components/result-share"
import { emptyDimensions, type DimensionKey } from "@/lib/dimension-scoring"
import { isQuestionAnswered, questionHasBlankLastOption, usedOnlyFreeTextAnswers } from "@/lib/game-question-answer"
import { UNPREDICTABLE_PERSONALITY_CARD, getPersonalityCard } from "@/lib/personality-cards"
import { submitGameDecisions } from "@/lib/submit-game-decisions"
import type { GameQuestionRow } from "@/lib/types/game-api"
import { useGameStore } from "@/lib/stores/use-game-store"

interface ResultScoresPayload {
  ok: boolean
  averages: Record<DimensionKey, number>
  dominant: DimensionKey
  decisionCount: number
  /** All answers were free-text only; skip dimension scoring. */
  unpredictable?: boolean
}

export default function PlayResultPage() {
  const router = useRouter()
  const profile = useGameStore((s) => s.profile)
  const answers = useGameStore((s) => s.answers)
  const otherAnswers = useGameStore((s) => s.otherAnswers ?? {})
  const consentAccepted = useGameStore((s) => s.consentAccepted)
  const clientSessionId = useGameStore((s) => s.clientSessionId)
  const scoresFetchStarted = useRef(false)

  const [questions, setQuestions] = useState<GameQuestionRow[] | null>(null)
  const [scoresLoading, setScoresLoading] = useState(false)
  const [scoresError, setScoresError] = useState<string | null>(null)
  const [apiResult, setApiResult] = useState<ResultScoresPayload | null>(null)

  const loadQuestions = useCallback(async () => {
    const res = await fetch("/api/game/questions")
    const data = (await res.json()) as { ok?: boolean; questions?: GameQuestionRow[] }
    if (res.ok && data.ok && data.questions) {
      setQuestions(data.questions)
    } else {
      setQuestions([])
    }
  }, [])

  useEffect(() => {
    void loadQuestions()
  }, [loadQuestions])

  const allAnswered =
    !!questions?.length && questions.every((q) => isQuestionAnswered(q, answers, otherAnswers))

  const loadScoresFromDb = useCallback(async () => {
    if (!clientSessionId || !questions?.length || !allAnswered || !consentAccepted) return

    setScoresLoading(true)
    setScoresError(null)

    try {
      const decisions = questions.map((q) => {
        const other = otherAnswers[q.id]?.trim()
        if (questionHasBlankLastOption(q) && other) {
          return { questionId: q.id, otherText: other }
        }
        return { questionId: q.id, optionId: answers[q.id]! }
      })

      const sub = await submitGameDecisions(clientSessionId, decisions)
      if (!sub.ok) {
        throw new Error(sub.error ?? "Could not save decisions")
      }

      const onlyFreeText = usedOnlyFreeTextAnswers(questions, answers, otherAnswers)
      if (onlyFreeText) {
        setApiResult({
          ok: true,
          unpredictable: true,
          averages: emptyDimensions(),
          dominant: "react",
          decisionCount: questions.length,
        })
        return
      }

      const res = await fetch(
        `/api/game/result-scores?sessionToken=${encodeURIComponent(clientSessionId)}`
      )
      const data = (await res.json()) as ResultScoresPayload & { error?: string }

      if (!res.ok || !data.ok || !data.averages || !data.dominant) {
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      setApiResult({
        ok: true,
        unpredictable: false,
        averages: data.averages,
        dominant: data.dominant,
        decisionCount: data.decisionCount,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong"
      setScoresError(msg)
      toast.message("Could not load scores from the database", { description: msg })
    } finally {
      setScoresLoading(false)
    }
  }, [clientSessionId, questions, answers, otherAnswers, allAnswered, consentAccepted])

  useEffect(() => {
    if (!allAnswered || !questions?.length || !clientSessionId || !consentAccepted) return
    if (scoresFetchStarted.current) return
    scoresFetchStarted.current = true
    void loadScoresFromDb()
  }, [allAnswered, questions, clientSessionId, consentAccepted, loadScoresFromDb])

  useEffect(() => {
    if (!profile) {
      router.replace("/play/profile")
      return
    }
    if (questions && !allAnswered) {
      router.replace("/play/questions")
    }
  }, [profile, questions, allAnswered, router])

  if (!profile) return null

  if (questions === null) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 text-sm text-muted-foreground">
        Loading results…
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-10 text-center text-sm text-muted-foreground">
        No questions found in the database. Add seed data in Supabase, then return to the quiz.
      </div>
    )
  }

  if (!allAnswered) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 text-sm text-muted-foreground">
        Loading results…
      </div>
    )
  }

  const personality =
    apiResult?.unpredictable === true
      ? UNPREDICTABLE_PERSONALITY_CARD
      : apiResult?.dominant != null
        ? getPersonalityCard(apiResult.dominant)
        : null

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      {(scoresLoading || !apiResult) && !scoresError && (
        <p className="text-sm text-muted-foreground">
          Saving your answers and loading your result from Supabase…
        </p>
      )}

      {scoresError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="text-destructive font-medium">Could not load database scores</p>
          <p className="mt-1 text-muted-foreground">{scoresError}</p>
          <Button type="button" variant="outline" size="sm" className="mt-4 rounded-full" onClick={() => void loadScoresFromDb()}>
            Retry
          </Button>
        </div>
      )}

      {apiResult && personality && (
        <>
          <PersonalityFlipCard
            key={apiResult.unpredictable ? "unpredictable" : apiResult.dominant}
            personality={personality}
          />
          <div className="mt-10 grid w-full grid-cols-3 gap-2 sm:gap-3">
            <Button asChild variant="outline" className="h-10 min-w-0 rounded-full px-2 text-xs sm:px-4 sm:text-sm">
              <Link href="/archetypes" className="text-center leading-tight">
                Archetypes
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 min-w-0 rounded-full px-2 text-xs sm:px-4 sm:text-sm">
              <Link href="/">Home</Link>
            </Button>
            <div className="min-w-0">
              <ResultShare
                personalityTitle={personality.title}
                nickname={profile.nickname}
                triggerLabel="Share"
                triggerClassName="h-10 w-full px-2 text-xs sm:px-4 sm:text-sm"
              />
            </div>
          </div>
        </>
      )}

      {!(apiResult && personality) && (
        <div className="mt-12 flex flex-wrap gap-4">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/archetypes">Archetypes</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Home</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
