import type { GameQuestionRow } from "@/lib/types/game-api"

export function isQuestionAnswered(q: GameQuestionRow, answers: Record<string, string>): boolean {
  const opts = q.options ?? []
  if (!opts.length) return false
  return !!answers[q.id]
}


