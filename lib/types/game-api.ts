/** Shapes returned by GET /api/game/questions (matches Supabase tables). */

export interface GameOptionRow {
  id: string
  option_key: string
  option_text: string
  weight_react: number
  weight_trust: number
  weight_indep: number
  weight_adapt: number
  weight_mobil: number
  weight_safety: number
}

export interface GameQuestionRow {
  id: string
  order_index: number
  question_text: string
  options: GameOptionRow[]
}
