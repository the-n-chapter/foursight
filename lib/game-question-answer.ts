import type { GameQuestionRow } from "@/lib/types/game-api"

/** Last option row is reserved for free text when `option_text` is empty in the DB. */
export function questionHasBlankLastOption(q: GameQuestionRow): boolean {
  const opts = q.options ?? []
  const last = opts.at(-1)
  return last != null && !String(last.option_text).trim()
}

export function isQuestionAnswered(
  q: GameQuestionRow,
  answers: Record<string, string>,
  otherAnswers: Record<string, string>
): boolean {
  const opts = q.options ?? []
  if (!opts.length) return false
  if (questionHasBlankLastOption(q)) {
    return !!(answers[q.id] || otherAnswers[q.id]?.trim())
  }
  return !!answers[q.id]
}

/**
 * True when every question is answered only via the free-text row (no multiple-choice picks).
 * Requires each question to have a blank last option; otherwise normal MC applies and this is false.
 */
export function usedOnlyFreeTextAnswers(
  questions: GameQuestionRow[],
  answers: Record<string, string>,
  otherAnswers: Record<string, string>
): boolean {
  if (!questions.length) return false
  for (const q of questions) {
    if (!isQuestionAnswered(q, answers, otherAnswers)) return false
    if (!questionHasBlankLastOption(q)) return false
    if (answers[q.id]) return false
    if (!otherAnswers[q.id]?.trim()) return false
  }
  return true
}


