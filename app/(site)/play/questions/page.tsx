"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import type { Swiper as SwiperInstance } from "swiper"
import { EffectCoverflow } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isQuestionAnswered } from "@/lib/game-question-answer"
import { cn } from "@/lib/utils"
import type { GameQuestionRow } from "@/lib/types/game-api"
import { useGameStore } from "@/lib/stores/use-game-store"
import "swiper/css"
import "swiper/css/effect-coverflow"

const WHAT_DO_YOU_DO = /What do you do\??/i

const scenarioQuestionClass = "text-sky-600 dark:text-sky-300"

/** Match card index (0-based): 4th card → 3, 5th → 4 */
const SCENARIO_BLACK_PHRASE: Record<number, RegExp> = {
  3: /(How do you choose to go\??)/i,
  4: /(What['\u2019]s your next move\??)/i,
}

const promptBlackClass = scenarioQuestionClass

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
const urgentNoticeLineClass =
  "inline-flex max-w-full flex-wrap items-center gap-1 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-sm font-medium text-destructive animate-pulse"
const urgentNoticeLabelClass =
  "rounded-sm bg-destructive px-1.5 py-0.5 text-[0.68rem] font-bold tracking-wide text-destructive-foreground"
const HIGH_RISK_ALERT_RE = /(your region is in a high risk level,\s*please leave now!)/gi
const MANDATORY_EVAC_RE =
  /(Evacuation is now mandatory\.\s*You have two hours to get to the assembly point A\s*\[address:\s*B\]\.?)/gi

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
    const pieces = text.split(
      /(NOTICE:\s*[^\n]+|your region is in a high risk level,\s*please leave now!|Evacuation is now mandatory\.\s*You have two hours to get to the assembly point A\s*\[address:\s*B\]\.?)/gi
    )
    if (pieces.length === 1) {
      return <span className={className}>{splitLocationMarkers(text)}</span>
    }
    return (
      <span className={className}>
        {pieces.map((part, i) => {
          const m = /^NOTICE:\s*(.*)$/i.exec(part.trim())
          if (m) {
            return (
              <span key={i} className={urgentNoticeLineClass}>
                <span className={urgentNoticeLabelClass}>NOTICE</span>
                <span>{splitLocationMarkers(m[1])}</span>
              </span>
            )
          }
          if (HIGH_RISK_ALERT_RE.test(part.trim())) {
            HIGH_RISK_ALERT_RE.lastIndex = 0
            const normalized = part.trim().replace(/^your\b/i, "Your")
            return (
              <>
                <span key={`${i}-space`}> </span>
                <span key={i} className={urgentNoticeLineClass}>
                  <span className={urgentNoticeLabelClass}>NOTICE</span>
                  <span className="block basis-full">{splitLocationMarkers(normalized)}</span>
                </span>
              </>
            )
          }
          if (MANDATORY_EVAC_RE.test(part.trim())) {
            MANDATORY_EVAC_RE.lastIndex = 0
            return (
              <>
                <span key={`${i}-before`} className="block h-1.5" aria-hidden />
                <span key={i} className={urgentNoticeLineClass}>
                  <span className={urgentNoticeLabelClass}>NOTICE</span>
                  <span className="block basis-full">{splitLocationMarkers(part.trim())}</span>
                </span>
                <span key={`${i}-after`} className="block h-1.5" aria-hidden />
              </>
            )
          }
          return (
            <span key={i}>{splitLocationMarkers(part)}</span>
          )
        })}
      </span>
    )
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
  const stackSwiperRef = useRef<SwiperInstance | null>(null)
  const profile = useGameStore((s) => s.profile)
  const answers = useGameStore((s) => s.answers)
  const setAnswer = useGameStore((s) => s.setAnswer)
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

  useEffect(() => {
    if (!questions?.length) return
    stackSwiperRef.current?.slideTo(currentIndex, 320, false)
  }, [currentIndex, questions])

  const allAnswered = !!questions?.length && questions.every((q) => isQuestionAnswered(q, answers))

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
  const answeredCount = questions.filter((qq) => isQuestionAnswered(qq, answers)).length
  const hasCurrentAnswer = isQuestionAnswered(q, answers)
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
              className="pointer-events-none absolute left-1/2 top-0 z-0 w-[min(100%,30rem)] -translate-x-1/2"
              aria-hidden
            >
              <Swiper
                modules={[EffectCoverflow]}
                effect="coverflow"
                centeredSlides={true}
                slidesPerView={5}
                initialSlide={safeIndex}
                allowTouchMove={false}
                loop={false}
                speed={320}
                onSwiper={(swiper) => {
                  stackSwiperRef.current = swiper
                }}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 18,
                  depth: 135,
                  modifier: 1.15,
                  scale: 0.86,
                  slideShadows: false,
                }}
                className="h-12"
              >
                {questions.map((_, i) => (
                  <SwiperSlide key={i} className="!w-28 sm:!w-32">
                    <div
                      className={cn(
                        "mx-auto h-9 w-full rounded-t-lg border border-b-0 shadow-sm",
                        i < safeIndex ? "border-border bg-muted/90" : "border-border bg-muted/60"
                      )}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
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
                <CardTitle className="w-full text-left font-personality text-lg font-medium leading-relaxed whitespace-pre-wrap sm:text-xl">
                  <QuestionCardTitle text={q.question_text} cardIndex={safeIndex} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4 pb-6">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAnswer(q.id, opt.id)}
                      className={cn(
                        "w-full rounded-lg border px-4 py-3 text-left text-xs transition-colors sm:text-sm",
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
