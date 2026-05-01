"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PersonalityFlipCard } from "@/components/personality-flip-card"
import { ResultShare } from "@/components/result-share"
import type { DimensionKey } from "@/lib/dimension-scoring"
import { isQuestionAnswered } from "@/lib/game-question-answer"
import { getPersonalityCard } from "@/lib/personality-cards"
import { submitGameDecisions } from "@/lib/submit-game-decisions"
import type { GameQuestionRow } from "@/lib/types/game-api"
import { useGameStore } from "@/lib/stores/use-game-store"

interface ResultScoresPayload {
  ok: boolean
  averages: Record<DimensionKey, number>
  dominant: DimensionKey
  decisionCount: number
}

const RESULT_THEME: Record<
  DimensionKey,
  { frameBg: string; headerBg: string; shareButton: string; deco: string }
> = {
  react: {
    frameBg: "bg-[#FFE08A]",
    headerBg: "bg-[#FF4D6D]",
    shareButton: "bg-[#FF4D6D] hover:bg-[#ff7099]",
    deco: "bg-[#FF9E00]",
  },
  trust: {
    frameBg: "bg-[#DED2FF]",
    headerBg: "bg-[#7B61FF]",
    shareButton: "bg-[#7B61FF] hover:bg-[#9582ff]",
    deco: "bg-[#42C2FF]",
  },
  indep: {
    frameBg: "bg-[#FFD8A8]",
    headerBg: "bg-[#FF7A00]",
    shareButton: "bg-[#FF7A00] hover:bg-[#ff983d]",
    deco: "bg-[#FFC93C]",
  },
  adapt: {
    frameBg: "bg-[#CDFCCF]",
    headerBg: "bg-[#00C853]",
    shareButton: "bg-[#00C853] hover:bg-[#2de06f]",
    deco: "bg-[#7CFF8A]",
  },
  mobil: {
    frameBg: "bg-[#FFF2A8]",
    headerBg: "bg-[#FFD400]",
    shareButton: "bg-[#FFD400] hover:bg-[#ffdf4f]",
    deco: "bg-[#FF8C00]",
  },
  safety: {
    frameBg: "bg-[#CFF8FF]",
    headerBg: "bg-[#00B8D9]",
    shareButton: "bg-[#00B8D9] hover:bg-[#35cee9]",
    deco: "bg-[#8EECF5]",
  },
  commu: {
    frameBg: "bg-[#F4D3FF]",
    headerBg: "bg-[#E040FB]",
    shareButton: "bg-[#E040FB] hover:bg-[#e967ff]",
    deco: "bg-[#FF8AE2]",
  },
  prep: {
    frameBg: "bg-[#D7CCC8]",
    headerBg: "bg-[#4E342E]",
    shareButton: "bg-[#4E342E] hover:bg-[#5d4037]",
    deco: "bg-[#795548]",
  },
}

export default function PlayResultPage() {
  const { theme } = useTheme()
  const isSimple = theme === "simple"
  const router = useRouter()
  const profile = useGameStore((s) => s.profile)
  const answers = useGameStore((s) => s.answers)
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

  const allAnswered = !!questions?.length && questions.every((q) => isQuestionAnswered(q, answers))

  const loadScoresFromDb = useCallback(async () => {
    if (!clientSessionId || !questions?.length || !allAnswered || !consentAccepted) return

    setScoresLoading(true)
    setScoresError(null)

    try {
      const decisions = questions.map((q) => ({ questionId: q.id, optionId: answers[q.id]! }))

      const sub = await submitGameDecisions(clientSessionId, decisions)
      if (!sub.ok) {
        throw new Error(sub.error ?? "Could not save decisions")
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
  }, [clientSessionId, questions, answers, allAnswered, consentAccepted])

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
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <div className="rounded-none border-4 border-black bg-yellow-100 px-4 py-3 text-sm font-semibold text-black shadow-[6px_6px_0_0_#000]">
          Loading results…
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-10">
        <div className="rounded-none border-4 border-black bg-rose-100 px-4 py-3 text-center text-sm font-semibold text-black shadow-[6px_6px_0_0_#000]">
          No questions found in the database. Add seed data in Supabase, then return to the quiz.
        </div>
      </div>
    )
  }

  if (!allAnswered) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <div className="rounded-none border-4 border-black bg-yellow-100 px-4 py-3 text-sm font-semibold text-black shadow-[6px_6px_0_0_#000]">
          Loading results…
        </div>
      </div>
    )
  }

  const personality = apiResult?.dominant != null ? getPersonalityCard(apiResult.dominant) : null
  const resultTheme = apiResult ? RESULT_THEME[apiResult.dominant] : null

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
      {!isSimple && <div className="full-mode-only pointer-events-none absolute inset-0 -z-10 hidden md:block" aria-hidden>
        <span
          className={`absolute left-[4%] top-[9%] h-7 w-7 rotate-12 border-2 border-black shadow-[2px_2px_0_0_#000] ${resultTheme?.deco ?? "bg-fuchsia-300"}`}
        />
        <span className="absolute left-[11%] top-[26%] h-0 w-0 rotate-[20deg] border-l-[13px] border-r-[13px] border-b-[22px] border-l-transparent border-r-transparent border-b-orange-300 drop-shadow-[2px_2px_0_#000]" />
        <span className="absolute left-[8%] top-[62%] h-5 w-14 -rotate-6 border-2 border-black bg-yellow-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[3%] top-[11%] h-6 w-14 -rotate-12 rounded-full border-2 border-black bg-cyan-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[8%] top-[42%] h-9 w-9 rotate-12 border-2 border-black bg-violet-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[13%] bottom-[15%] h-0 w-0 -rotate-6 border-l-[15px] border-r-[15px] border-t-[22px] border-l-transparent border-r-transparent border-t-red-300 drop-shadow-[2px_2px_0_#000]" />
      </div>}
      <div className="mx-auto w-full max-w-xl">
      {(scoresLoading || !apiResult) && !scoresError && (
        <p className="rounded-none border-4 border-black bg-yellow-100 px-4 py-3 text-sm font-semibold text-black shadow-[6px_6px_0_0_#000]">
          Saving your answers and loading your result from the database…
        </p>
      )}

      {scoresError && (
        <div className="rounded-none border-4 border-black bg-rose-100 p-4 text-sm shadow-[6px_6px_0_0_#000]">
          <p className="font-extrabold text-red-700">Could not load database scores</p>
          <p className="mt-1 font-medium text-black">{scoresError}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 rounded-none border-2 border-black bg-white font-extrabold text-black shadow-[3px_3px_0_0_#000] hover:bg-yellow-100"
            onClick={() => void loadScoresFromDb()}
          >
            Retry
          </Button>
        </div>
      )}

      {apiResult && personality && (
        <>
          <PersonalityFlipCard
            key={apiResult.dominant}
            personality={personality}
            playerName={profile.nickname}
          />
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[8.5rem]">
              <ResultShare
                personalityTitle={personality.title}
                nickname={profile.nickname}
                triggerLabel="Share"
                triggerClassName="h-10 w-full rounded-none border-2 border-black bg-[#2e6cff] px-2 text-xs font-extrabold text-white shadow-[4px_4px_0_0_#000] hover:bg-[#1f57db] sm:px-4 sm:text-sm"
              />
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  )
}
