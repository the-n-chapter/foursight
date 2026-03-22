import { randomInt } from "crypto"
import {
  DIMENSION_KEYS,
  type DimensionKey,
  emptyDimensions,
} from "@/lib/dimension-scoring"

const EPS = 1e-9

export interface DecisionScoreRow {
  score_react: number
  score_trust: number
  score_indep: number
  score_adapt: number
  score_mobil: number
  score_safety: number
}

/** Average each dimension across decision rows; break ties with a uniform random choice. */
export function averagesAndDominantFromDecisions(
  rows: DecisionScoreRow[]
): { averages: Record<DimensionKey, number>; dominant: DimensionKey } | null {
  if (!rows.length) return null

  const sums = emptyDimensions()
  for (const r of rows) {
    sums.react += Number(r.score_react) || 0
    sums.trust += Number(r.score_trust) || 0
    sums.indep += Number(r.score_indep) || 0
    sums.adapt += Number(r.score_adapt) || 0
    sums.mobil += Number(r.score_mobil) || 0
    sums.safety += Number(r.score_safety) || 0
  }

  const n = rows.length
  const averages = {
    react: sums.react / n,
    trust: sums.trust / n,
    indep: sums.indep / n,
    adapt: sums.adapt / n,
    mobil: sums.mobil / n,
    safety: sums.safety / n,
  } satisfies Record<DimensionKey, number>

  let max = -Infinity
  for (const k of DIMENSION_KEYS) {
    if (averages[k] > max + EPS) max = averages[k]
  }

  const tied = DIMENSION_KEYS.filter((k) => Math.abs(averages[k] - max) <= EPS)
  const dominant = tied[randomInt(tied.length)]!

  return { averages, dominant }
}
