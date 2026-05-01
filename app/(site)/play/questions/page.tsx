"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
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

const scenarioQuestionClass = "font-medium text-black"

/** Match card index (0-based): 4th card → 3, 5th → 4 */
const SCENARIO_BLACK_PHRASE: Record<number, RegExp> = {
  3: /(How do you choose to go\??)/i,
  4: /(What['\u2019]s your next move\??)/i,
}

const promptBlackClass = "font-semibold text-black"

function isHazardNoticeBlock(text: string) {
  return /NOTICE:\s*Hazardous Release/i.test(text) && /\[your location\]/.test(text)
}

/** `!` before `NOTICE` → danger icon; quote only “From … Authorities.” then close; rest unquoted. */
const BANG_BEFORE_NOTICE = /!\s*(?=NOTICE\b)/i
/** Allows optional “The” and spacing so DB copy variants still match. */
const FROM_THE_AUTHORITIES_SEGMENT = /(From\s+(?:the\s+)?Authorities\.?)/i

/** NOTICE block: danger icon + text; border height follows content (no full-width stretch). */
const hazardNoticeIndentClass =
  "mt-1 inline-flex max-w-full self-start gap-1.5 rounded-md border-2 border-amber-500/70 bg-amber-100 px-2 py-1.5 align-top sm:mt-1.5 sm:gap-2 sm:px-3 sm:py-2"

const hazardNoticeIconClass =
  "mt-0.5 h-[1.1em] w-[1.1em] shrink-0 text-red-600 sm:mt-1"
const urgentNoticeLineClass =
  "inline-flex max-w-full flex-wrap items-center gap-1 rounded-md border-2 border-red-600 bg-yellow-200 px-2 py-1 text-sm font-bold text-red-700"
const urgentNoticeLabelClass =
  "rounded-sm bg-red-600 px-1.5 py-0.5 text-[0.68rem] font-extrabold tracking-wide text-white"
const securityAlertHighlightClass =
  "inline bg-[linear-gradient(transparent_58%,#FFEB3B_58%)] px-0.5 text-black"
const HIGH_RISK_ALERT_RE = /(your region is in a high risk level,\s*please leave now!)/gi
const MANDATORY_EVAC_RE =
  /(Evacuation is now mandatory\.\s*You have two hours to get to the assembly point A(?:\s*\[address:\s*B\])?\.?)/gi

function isSecuritySituationMessage(text: string) {
  const normalized = text.trim().toLowerCase()
  return (
    normalized.includes("security situation in your area has escalated") &&
    normalized.includes("no immediate action is required at this time") &&
    normalized.includes("stay alert and follow official updates")
  )
}

const SECURITY_SENTENCE_RE =
  /((?:The\s+)?security situation in your area has escalated\.\s*No immediate action is required at this time\.\s*Stay alert and follow official updates\.?)/i
const MANDATORY_EVAC_SENTENCE_RE =
  /(Evacuation is now mandatory\.\s*You have two hours to get to the assembly point A(?:\s*\[address:\s*B\])?\.?)/i
const HIGH_RISK_ALERT_SENTENCE_RE = /(your region is in a high risk level,\s*please leave now!)/i
const ALERT_TEXT_CARD_INDEXES = new Set([0, 3, 4])

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

function ScenarioRichText({ text, className, cardIndex }: { text: string; className: string; cardIndex: number }) {
  const hazard = isHazardNoticeBlock(text)
  const shouldUseSecurityHighlight = cardIndex === 0 || cardIndex === 3 || cardIndex === 4

  if (!hazard) {
    const securitySentenceMatch = SECURITY_SENTENCE_RE.exec(text)
    if (securitySentenceMatch && securitySentenceMatch.index !== undefined) {
      const start = securitySentenceMatch.index
      const matchText = securitySentenceMatch[1]
      const before = text.slice(0, start)
      const after = text.slice(start + matchText.length)
      return (
        <span className={className}>
          {before ? <span>{splitLocationMarkers(before)}</span> : null}
          <span className={shouldUseSecurityHighlight ? securityAlertHighlightClass : "font-semibold text-[#4f46e5]"}>
            {splitLocationMarkers(matchText)}
          </span>
          {after ? <span>{splitLocationMarkers(after)}</span> : null}
        </span>
      )
    }

    const pieces = text.split(
      /(NOTICE:\s*[^\n]+|(?:The\s+)?security situation in your area has escalated\.\s*No immediate action is required at this time\.\s*Stay alert and follow official updates\.?|your region is in a high risk level,\s*please leave now!|Evacuation is now mandatory\.\s*You have two hours to get to the assembly point A\s*\[address:\s*B\]\.?)/gi
    )
    if (pieces.length === 1) {
      return <span className={className}>{splitLocationMarkers(text)}</span>
    }
    return (
      <span className={className}>
        {pieces.map((part, i) => {
          const m = /^NOTICE:\s*(.*)$/i.exec(part.trim())
          if (m) {
            const isSecurityMessage = isSecuritySituationMessage(m[1])
            return (
              <span key={i} className={urgentNoticeLineClass}>
                <span className={urgentNoticeLabelClass}>NOTICE</span>
                <span
                  className={
                    isSecurityMessage
                      ? shouldUseSecurityHighlight
                        ? securityAlertHighlightClass
                        : "font-semibold text-[#4f46e5]"
                      : "font-semibold"
                  }
                >
                  {splitLocationMarkers(m[1])}
                </span>
              </span>
            )
          }
          if (isSecuritySituationMessage(part)) {
            return (
              <span key={i} className={urgentNoticeLineClass}>
                <span className={urgentNoticeLabelClass}>NOTICE</span>
                <span className={shouldUseSecurityHighlight ? securityAlertHighlightClass : "font-semibold text-[#4f46e5]"}>
                  {splitLocationMarkers(part.trim())}
                </span>
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
            const normalized = part.trim().replace(/^evacuation\b/i, "Evacuation")
            return (
              <span key={i} className={urgentNoticeLineClass}>
                <span className={urgentNoticeLabelClass}>
                  NOTICE
                </span>
                <span className="block basis-full">{splitLocationMarkers(normalized)}</span>
              </span>
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

function renderScenarioWithBlackPhrase(before: string, cardIndex: number, scenarioClassName = scenarioQuestionClass) {
  const re = SCENARIO_BLACK_PHRASE[cardIndex]
  if (!re) {
    return <ScenarioRichText text={before} className={scenarioClassName} cardIndex={cardIndex} />
  }
  const parts = before.split(re)
  if (parts.length === 1) {
    return <ScenarioRichText text={before} className={scenarioClassName} cardIndex={cardIndex} />
  }
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={promptBlackClass}>
            {part}
          </span>
        ) : (
          <ScenarioRichText key={i} text={part} className={scenarioClassName} cardIndex={cardIndex} />
        )
      )}
    </>
  )
}

function splitFinalQuestionPrompt(text: string) {
  const normalized = text.replace(/\s+$/, "")
  const qIndex = normalized.lastIndexOf("?")
  if (qIndex === -1) {
    return { before: text, prompt: "" }
  }
  const before = normalized.slice(0, qIndex + 1)
  const prevQIndex = before.lastIndexOf("?", qIndex - 1)
  const promptStart = prevQIndex === -1 ? 0 : prevQIndex + 1
  const prompt = before.slice(promptStart).trimStart()
  const scenario = before.slice(0, promptStart)
  return { before: scenario, prompt }
}

function QuestionCardTitle({ text, cardIndex }: { text: string; cardIndex: number }) {
  const shouldSeparateAlertText = ALERT_TEXT_CARD_INDEXES.has(cardIndex) || cardIndex === 4
  const alertMatch = shouldSeparateAlertText
    ? SECURITY_SENTENCE_RE.exec(text) ?? MANDATORY_EVAC_SENTENCE_RE.exec(text) ?? HIGH_RISK_ALERT_SENTENCE_RE.exec(text)
    : null

  if (alertMatch && alertMatch.index !== undefined) {
    const alertStart = alertMatch.index
    const alertText = alertMatch[1].trim()
    const beforeAlert = text.slice(0, alertStart).trimEnd()
    const afterAlert = text.slice(alertStart + alertMatch[1].length).trimStart()
    const { before: afterBeforePrompt, prompt: afterPrompt } = splitFinalQuestionPrompt(afterAlert)

    return (
      <>
        {beforeAlert ? renderScenarioWithBlackPhrase(beforeAlert, cardIndex, "font-bold text-black") : null}
        <span className="my-3 block animate-pulse rounded-md border-2 border-rose-200 bg-rose-50 px-3 py-2 text-[0.85rem] font-normal leading-relaxed text-rose-900 shadow-[0_0_0_2px_rgba(251,113,133,0.12)]">
          <span className="mr-2 inline-block rounded-sm bg-rose-600 px-1.5 py-0.5 text-[0.68rem] font-extrabold tracking-wide text-white">
            NOTICE
          </span>
          <span className="notice-body">{alertText}</span>
        </span>
        {afterBeforePrompt ? renderScenarioWithBlackPhrase(afterBeforePrompt, cardIndex) : null}
        {afterPrompt ? <span className="block font-bold text-black">{afterPrompt}</span> : null}
      </>
    )
  }

  const { before, prompt } = splitFinalQuestionPrompt(text)
  if (!prompt) {
    return <>{renderScenarioWithBlackPhrase(text, cardIndex)}</>
  }

  return (
    <>
      {before ? renderScenarioWithBlackPhrase(before, cardIndex) : null}
      <span className="block font-bold text-black">{prompt}</span>
    </>
  )
}

export default function PlayQuestionsPage() {
  const { theme } = useTheme()
  const isSimple = theme === "simple"
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
  const greetingName = profile.nickname?.trim() || "there"
  const answeredCount = questions.filter((qq) => isQuestionAnswered(qq, answers)).length
  const hasCurrentAnswer = isQuestionAnswered(q, answers)
  const isFirst = safeIndex === 0
  const isLast = safeIndex === total - 1

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
      {!isSimple && <div className="full-mode-only pointer-events-none absolute inset-0 -z-10 hidden md:block" aria-hidden>
        <span className="absolute left-[4%] top-[8%] h-7 w-7 rotate-12 border-2 border-black bg-fuchsia-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute left-[13%] top-[22%] h-0 w-0 rotate-[20deg] border-l-[13px] border-r-[13px] border-b-[22px] border-l-transparent border-r-transparent border-b-orange-300 drop-shadow-[2px_2px_0_#000]" />
        <span className="absolute left-[6%] top-[44%] h-9 w-9 rotate-45 border-2 border-black bg-lime-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute left-[11%] top-[66%] h-5 w-14 -rotate-6 border-2 border-black bg-yellow-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute left-[16%] bottom-[10%] h-7 w-7 -rotate-12 rounded-full border-2 border-black bg-emerald-300 shadow-[2px_2px_0_0_#000]" />

        <span className="absolute left-[26%] top-[2%] h-6 w-16 -rotate-[8deg] border-2 border-black bg-sky-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute left-[43%] top-[84%] h-6 w-6 rotate-[30deg] border-2 border-black bg-pink-300 shadow-[2px_2px_0_0_#000]" />

        <span className="absolute right-[2%] top-[5%] h-6 w-14 -rotate-12 rounded-full border-2 border-black bg-cyan-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[20%] top-[12%] h-7 w-7 rotate-45 border-2 border-black bg-lime-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[3%] top-[31%] h-8 w-8 -rotate-12 rounded-full border-2 border-black bg-rose-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[9%] top-[56%] h-9 w-9 rotate-12 border-2 border-black bg-violet-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[15%] bottom-[18%] h-0 w-0 -rotate-6 border-l-[15px] border-r-[15px] border-t-[22px] border-l-transparent border-r-transparent border-t-red-300 drop-shadow-[2px_2px_0_#000]" />
        <span className="absolute right-[5%] bottom-[8%] h-6 w-6 -rotate-12 border-2 border-black bg-amber-300 shadow-[2px_2px_0_0_#000]" />
      </div>}
      <div className="mx-auto w-full max-w-xl">
        <h1 className="font-personality text-balance text-center text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Hi, {greetingName}
        </h1>

      {/* Folder: stacked “tabs” + front card */}
      <div className="mt-12">
        <div className="relative px-2 sm:px-4">
          {total > 1 && !isSimple && (
            <div
              className="full-mode-only pointer-events-none absolute left-1/2 top-0 z-0 w-[min(100%,30rem)] -translate-x-1/2"
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
                        "mx-auto h-9 w-full rounded-none border-2 border-b-0 border-black bg-yellow-200 shadow-[4px_-4px_0_0_#000]",
                        i < safeIndex ? "bg-pink-200" : "bg-yellow-200"
                      )}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <div
            className={cn(
              "relative z-10 rounded-none border-4 border-black bg-white text-black shadow-[8px_8px_0_0_#000]",
              total > 1 ? "mt-10" : ""
            )}
          >
            <div className="flex items-center justify-between border-b-4 border-black bg-cyan-300 px-4 py-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-black">
                Card {safeIndex + 1} of {total}
              </span>
              <span className="text-xs font-bold text-black">
                {allAnswered ? "Complete" : `${answeredCount}/${total} answered`}
              </span>
            </div>

            <Card className="rounded-none border-0 bg-white text-black shadow-none">
              <CardHeader className="bg-white pb-3 pt-4">
                <CardTitle className="w-full text-left font-personality text-sm font-bold leading-relaxed whitespace-pre-wrap sm:text-base">
                  <div
                    className={cn(
                      "relative rounded-2xl border-4 border-black bg-yellow-100 px-4 py-3 shadow-[6px_6px_0_0_#000]",
                      safeIndex === 0 ? "[&_*]:!font-bold [&_*.notice-body]:!font-normal" : ""
                    )}
                  >
                    <span
                      aria-hidden
                      className="absolute -bottom-3 left-8 h-5 w-5 rotate-45 border-b-4 border-r-4 border-black bg-yellow-100"
                    />
                    <QuestionCardTitle text={q.question_text} cardIndex={safeIndex} />
                  </div>
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
                        "w-full rounded-none border-2 border-black px-4 py-3 text-left text-xs font-medium text-black transition-all duration-150 sm:text-sm",
                        selected
                          ? "bg-lime-300 shadow-[4px_4px_0_0_#000] translate-x-[-1px] translate-y-[-1px]"
                          : "bg-white hover:bg-purple-100 hover:shadow-[3px_3px_0_0_#000]"
                      )}
                    >
                      <span className="mr-2 font-extrabold text-black">{opt.option_key}.</span>
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
            className={`${questionNavPrevClass} rounded-none border-2 border-black bg-white font-extrabold text-black shadow-[4px_4px_0_0_#000] hover:bg-yellow-100`}
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
              className={`${questionNavNextClass} rounded-none border-2 border-black bg-pink-300 font-extrabold text-black shadow-[4px_4px_0_0_#000] hover:bg-pink-200`}
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
              className={`${questionNavNextClass} rounded-none border-2 border-black bg-cyan-300 font-extrabold text-black shadow-[4px_4px_0_0_#000] hover:bg-cyan-200`}
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
    </div>
  )
}
