import { randomInt } from "crypto"
import {
  DIMENSION_KEYS,
  type DimensionKey,
  emptyDimensions,
} from "@/lib/dimension-scoring"

const EPS = 1e-9

export interface DecisionScoreRow {
  question_id: string
  score_react: number
  score_trust: number
  score_indep: number
  score_adapt: number
  score_mobil: number
  score_safety: number
  score_commu: number
  score_prep: number
}

export interface OptionWeightRow {
  question_id: string
  weight_react: number
  weight_trust: number
  weight_indep: number
  weight_adapt: number
  weight_mobil: number
  weight_safety: number
  weight_commu: number
  weight_prep: number
}

/**
 * Normalize each dimension by its theoretical min/max range across answered questions,
 * then choose dominant from normalized scores (tie -> uniform random).
 */
export function normalizedDominantFromDecisions(
  rows: DecisionScoreRow[],
  optionRows: OptionWeightRow[]
): { averages: Record<DimensionKey, number>; dominant: DimensionKey } | null {
  if (!rows.length) return null

  const totals = emptyDimensions()
  for (const r of rows) {
    totals.react += Number(r.score_react) || 0
    totals.trust += Number(r.score_trust) || 0
    totals.indep += Number(r.score_indep) || 0
    totals.adapt += Number(r.score_adapt) || 0
    totals.mobil += Number(r.score_mobil) || 0
    totals.safety += Number(r.score_safety) || 0
    totals.commu += Number(r.score_commu) || 0
    totals.prep += Number(r.score_prep) || 0
  }

  const byQuestion = new Map<string, OptionWeightRow[]>()
  for (const opt of optionRows) {
    const list = byQuestion.get(opt.question_id)
    if (list) list.push(opt)
    else byQuestion.set(opt.question_id, [opt])
  }

  const minTotals = emptyDimensions()
  const maxTotals = emptyDimensions()
  for (const qid of new Set(rows.map((r) => r.question_id))) {
    const opts = byQuestion.get(qid)
    if (!opts?.length) return null
    for (const k of DIMENSION_KEYS) {
      let qMin = Infinity
      let qMax = -Infinity
      for (const o of opts) {
        const key = `weight_${k}` as const
        const v = Number(o[key]) || 0
        if (v < qMin) qMin = v
        if (v > qMax) qMax = v
      }
      minTotals[k] += qMin
      maxTotals[k] += qMax
    }
  }

  const averages = {
    react: normalizePercent(totals.react, minTotals.react, maxTotals.react),
    trust: normalizePercent(totals.trust, minTotals.trust, maxTotals.trust),
    indep: normalizePercent(totals.indep, minTotals.indep, maxTotals.indep),
    adapt: normalizePercent(totals.adapt, minTotals.adapt, maxTotals.adapt),
    mobil: normalizePercent(totals.mobil, minTotals.mobil, maxTotals.mobil),
    safety: normalizePercent(totals.safety, minTotals.safety, maxTotals.safety),
    commu: normalizePercent(totals.commu, minTotals.commu, maxTotals.commu),
    prep: normalizePercent(totals.prep, minTotals.prep, maxTotals.prep),
  } satisfies Record<DimensionKey, number>

  let max = -Infinity
  for (const k of DIMENSION_KEYS) {
    if (averages[k] > max + EPS) max = averages[k]
  }

  const tied = DIMENSION_KEYS.filter((k) => Math.abs(averages[k] - max) <= EPS)
  const dominant = tied[randomInt(tied.length)]!

  return { averages, dominant }
}

function normalizePercent(value: number, min: number, max: number): number {
  const range = max - min
  if (range <= EPS) return 50
  return ((value - min) / range) * 100
}
