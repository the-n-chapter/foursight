"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { isQuestionAnswered } from "@/lib/game-question-answer"
import { cn } from "@/lib/utils"
import type { GameQuestionRow } from "@/lib/types/game-api"
import { useGameStore } from "@/lib/stores/use-game-store"

const WHAT_DO_YOU_DO = /What do you do\??/i

const scenarioQuestionClass = "text-sky-600 dark:text-sky-300"

/** Match card index (0-based): 4th card → 3, 5th → 4 */
const SCENARIO_BLACK_PHRASE: Record<number, RegExp> = {
  3: /(How do you choose to go\??)/i,
  4: /(What['\u2019]s your next move\??)/i,
}

const promptBlackClass = "text-foreground"

const OTHER_ANSWER_MAX_LEN = 2000

function isHazardNoticeBlock(text: string) {
  return /NOTICE:\s*Hazardous Release/i.test(text) && /\[your location\]/.test(text)
}

/** `!` before `NOTICE` → danger icon; quote only “From … Authorities.” then close; rest unquoted. */
const BANG_BEFORE_NOTICE = /!\s*(?=NOTICE\b)/i
/** Allows optional “The” and spacing so DB copy variants still match. */
const FROM_THE_AUTHORITIES_SEGMENT = /(From\s+(?:the\s+)?Authorities\.?)/i

/** NOTICE block: danger icon + text; border height follows content (no full-width stretch). */
const hazardNoticeIndentClass =
  "mt-1 inline-flex max-w-full self-start gap-1.5 border-l-2 border-sky-500/35 pl-3 align-top sm:mt-1.5 sm:gap-2 sm:pl-4 dark:border-sky-400/30"

const hazardNoticeIconClass =
  "mt-0.5 h-[1.1em] w-[1.1em] shrink-0 text-destructive sm:mt-1"

function splitLocationMarkers(chunk: string): ReactNode[] {
  const segs = chunk.split(/(\[your location\])/g)
  return segs.map((part, i) =>
    part === "[your location]" ? (
      <span key={i} className="text-muted-foreground">
        [your location]
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

function ScenarioRichText({ text, className }: { text: string; className: string }) {
  const hazard = isHazardNoticeBlock(text)

  if (!hazard) {
    return <span className={className}>{splitLocationMarkers(text)}</span>
  }

  // Use full `text` for the bang split so “[your location] …” tails are not parked after a closing quote.
  const bang = BANG_BEFORE_NOTICE.exec(text)
  const bangIdx = bang?.index
  const beforeBang = bangIdx != null ? text.slice(0, bangIdx) : text
  const afterBang =
    bangIdx != null ? text.slice(bangIdx).replace(BANG_BEFORE_NOTICE, "") : text.replace(/^\s*!\s*/, "")

  const authMatch = FROM_THE_AUTHORITIES_SEGMENT.exec(beforeBang)
  if (authMatch) {
    const prefix = beforeBang.slice(0, authMatch.index)
    const authPhrase = authMatch[1]
    const betweenAuthAndBang = beforeBang.slice(authMatch.index + authPhrase.length).replace(/^\s+/, "")
    return (
      <span className={className}>
        {prefix}
        <span aria-hidden className="select-none">
          &ldquo;
        </span>
        {authPhrase}
        <span aria-hidden className="select-none">
          &rdquo;
        </span>
        {betweenAuthAndBang ? betweenAuthAndBang : null}
        <span className={hazardNoticeIndentClass}>
          <AlertTriangle className={hazardNoticeIconClass} aria-hidden />
          <span className="min-w-0 leading-relaxed">{splitLocationMarkers(afterBang)}</span>
        </span>
      </span>
    )
  }

  // Hazard but no “From … Authorities” match: icon + notice, no typographic quotes (avoids a stray ” before “What do you do?”).
  if (bangIdx != null) {
    return (
      <span className={className}>
        {beforeBang}
        <span className={hazardNoticeIndentClass}>
          <AlertTriangle className={hazardNoticeIconClass} aria-hidden />
          <span className="min-w-0 leading-relaxed">{splitLocationMarkers(afterBang)}</span>
        </span>
      </span>
    )
  }

  return <span className={className}>{splitLocationMarkers(text)}</span>
}

/** Icon + label in one row; +1 unit padding toward the gap between prev / next. */
const questionNavPrevClass = "gap-1 rounded-full pl-3 pr-4"
const questionNavNextClass = "gap-1 rounded-full pl-4 pr-3"

function renderScenarioWithBlackPhrase(before: string, cardIndex: number) {
  const re = SCENARIO_BLACK_PHRASE[cardIndex]
  if (!re) {
    return <ScenarioRichText text={before} className={scenarioQuestionClass} />
  }
  const parts = before.split(re)
  if (parts.length === 1) {
    return <ScenarioRichText text={before} className={scenarioQuestionClass} />
  }
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={promptBlackClass}>
            {part}
          </span>
        ) : (
          <ScenarioRichText key={i} text={part} className={scenarioQuestionClass} />
        )
      )}
    </>
  )
}

function QuestionCardTitle({ text, cardIndex }: { text: string; cardIndex: number }) {
  const match = WHAT_DO_YOU_DO.exec(text)
  if (!match || match.index === undefined) {
    return <>{renderScenarioWithBlackPhrase(text, cardIndex)}</>
  }
  const before = text.slice(0, match.index)
  const fromPrompt = text.slice(match.index)
  return (
    <>
      {before ? renderScenarioWithBlackPhrase(before, cardIndex) : null}
      <span className="text-foreground">{fromPrompt}</span>
    </>
  )
}

export default function PlayQuestionsPage() {
  const router = useRouter()
  const profile = useGameStore((s) => s.profile)
  const answers = useGameStore((s) => s.answers)
  const otherAnswers = useGameStore((s) => s.otherAnswers ?? {})
  const setAnswer = useGameStore((s) => s.setAnswer)
  const setOtherAnswer = useGameStore((s) => s.setOtherAnswer)
  const [questions, setQuestions] = useState<GameQuestionRow[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const loadQuestions = useCallback(async () => {
    setLoadError(null)
    try {
      const res = await fetch("/api/game/questions")
      const data = (await res.json()) as { ok?: boolean; questions?: GameQuestionRow[]; error?: string }
      if (!res.ok || !data.ok || !data.questions?.length) {
        setLoadError(data.error ?? "Could not load questions from the database.")
        setQuestions(null)
        return
      }
      setQuestions(data.questions)
      setCurrentIndex(0)
    } catch {
      setLoadError("Network error loading questions.")
      setQuestions(null)
    }
  }, [])

  useEffect(() => {
    if (!profile) router.replace("/play/profile")
  }, [profile, router])

  useEffect(() => {
    if (profile) void loadQuestions()
  }, [profile, loadQuestions])

  useEffect(() => {
    if (questions?.length) {
      setCurrentIndex((i) => Math.min(i, questions.length - 1))
    }
  }, [questions])

  const allAnswered =
    !!questions?.length && questions.every((q) => isQuestionAnswered(q, answers, otherAnswers))

  const finish = () => {
    if (!allAnswered) return
    router.push("/play/result")
  }

  if (!profile) return null

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-10 text-center">
        <p className="text-sm text-destructive">{loadError}</p>
        <Button type="button" className="mt-6 rounded-full" onClick={() => void loadQuestions()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!questions) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 text-sm text-muted-foreground">
        Loading questions…
      </div>
    )
  }

  const total = questions.length
  const safeIndex = Math.min(Math.max(0, currentIndex), total - 1)
  const q = questions[safeIndex]
  const answeredCount = questions.filter((qq) => isQuestionAnswered(qq, answers, otherAnswers)).length
  const hasCurrentAnswer = isQuestionAnswered(q, answers, otherAnswers)
  const isFirst = safeIndex === 0
  const isLast = safeIndex === total - 1

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="font-personality text-balance text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Questions
      </h1>

      {/* Folder: stacked “tabs” + front card */}
      <div className="mt-12">
        <div className="relative px-2 sm:px-4">
          {total > 1 && (
            <div
              className="pointer-events-none absolute left-1/2 top-0 z-0 w-[min(100%,28rem)] -translate-x-1/2"
              aria-hidden
            >
              {questions.map((_, i) => {
                const offset = (total - 1 - i) * 6
                const isPast = i < safeIndex
                const isActive = i === safeIndex
                return (
                  <div
                    key={i}
                    className={cn(
                      "absolute left-1/2 h-9 w-[94%] -translate-x-1/2 rounded-t-lg border border-b-0 shadow-sm transition-colors",
                      isActive && "border-primary/40 bg-primary/10",
                      isPast && !isActive && "border-border bg-muted/90",
                      !isPast && !isActive && "border-border bg-muted/60"
                    )}
                    style={{ top: -offset, zIndex: total - i }}
                  />
                )
              })}
            </div>
          )}

          <div
            className={cn(
              "relative z-10 rounded-xl border-2 bg-card shadow-md",
              total > 1 ? "mt-10 border-primary/25" : "border-border"
            )}
          >
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 rounded-t-[10px]">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Card {safeIndex + 1} of {total}
              </span>
              <span className="text-xs text-muted-foreground">
                {allAnswered ? "Complete" : `${answeredCount}/${total} answered`}
              </span>
            </div>

            <Card className="border-0 shadow-none rounded-t-none rounded-b-xl">
              <CardHeader className="pb-2">
                <CardTitle className="w-full text-left font-personality text-base font-medium leading-relaxed whitespace-pre-wrap">
                  <QuestionCardTitle text={q.question_text} cardIndex={safeIndex} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4 pb-6">
                {q.options.map((opt, optIndex) => {
                  const isFreeTextSlot =
                    optIndex === q.options.length - 1 && !String(opt.option_text).trim()

                  if (isFreeTextSlot) {
                    const inputId = `free-text-${q.id}`
                    const otherRowActive = !answers[q.id] && q.id in otherAnswers
                    return (
                      <div
                        key={opt.id}
                        role="group"
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                          otherRowActive
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:bg-accent/60"
                        )}
                      >
                        <label
                          htmlFor={inputId}
                          className="shrink-0 cursor-pointer select-none font-medium text-primary"
                        >
                          {opt.option_key}.
                        </label>
                        <Input
                          id={inputId}
                          className="h-9 flex-1 min-w-0 border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          value={otherAnswers[q.id] ?? ""}
                          maxLength={OTHER_ANSWER_MAX_LEN}
                          placeholder="Your answer…"
                          aria-label={`Option ${opt.option_key}: type your own answer`}
                          onMouseDown={(e) => e.stopPropagation()}
                          onFocus={() => setOtherAnswer(q.id, otherAnswers[q.id] ?? "")}
                          onChange={(e) => setOtherAnswer(q.id, e.target.value)}
                        />
                      </div>
                    )
                  }

                  const selected = answers[q.id] === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAnswer(q.id, opt.id)}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                        selected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:bg-accent/60"
                      )}
                    >
                      <span className="mr-2 font-medium text-primary">{opt.option_key}.</span>
                      {opt.option_text}
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={questionNavPrevClass}
            disabled={isFirst}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
            Previous
          </Button>

          {isLast ? (
            <Button
              type="button"
              size="sm"
              className={questionNavNextClass}
              disabled={!allAnswered}
              onClick={() => {
                if (!allAnswered) {
                  toast.message("Answer every question to continue.")
                  return
                }
                finish()
              }}
            >
              See results
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={questionNavNextClass}
              disabled={!hasCurrentAnswer}
              onClick={() => {
                if (!hasCurrentAnswer) {
                  toast.message("Choose an answer first.")
                  return
                }
                setCurrentIndex((i) => Math.min(total - 1, i + 1))
              }}
            >
              Next
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
