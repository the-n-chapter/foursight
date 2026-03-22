import type { GameQuestionRow } from "@/lib/types/game-api"

export type DimensionKey = "react" | "trust" | "indep" | "adapt" | "mobil" | "safety"

export const DIMENSION_KEYS: DimensionKey[] = ["react", "trust", "indep", "adapt", "mobil", "safety"]

export function emptyDimensions(): Record<DimensionKey, number> {
  return { react: 0, trust: 0, indep: 0, adapt: 0, mobil: 0, safety: 0 }
}

export function computeDimensionTotals(
  questions: GameQuestionRow[],
  answersByQuestionId: Record<string, string>
): Record<DimensionKey, number> {
  const t = emptyDimensions()

  for (const q of questions) {
    const optionId = answersByQuestionId[q.id]
    if (!optionId) continue
    const opt = q.options.find((o) => o.id === optionId)
    if (!opt) continue
    t.react += opt.weight_react ?? 0
    t.trust += opt.weight_trust ?? 0
    t.indep += opt.weight_indep ?? 0
    t.adapt += opt.weight_adapt ?? 0
    t.mobil += opt.weight_mobil ?? 0
    t.safety += opt.weight_safety ?? 0
  }

  return t
}

export function topDimensions(
  totals: Record<DimensionKey, number>,
  count = 2
): DimensionKey[] {
  return DIMENSION_KEYS.slice()
    .sort((a, b) => totals[b] - totals[a])
    .slice(0, Math.max(1, count))
}
