import { NextResponse } from "next/server"
import { getSupabaseAdmin, supabaseMissingEnvMessage } from "@/lib/supabase/admin"
import type { GameOptionRow, GameQuestionRow } from "@/lib/types/game-api"

export const dynamic = "force-dynamic"

/** PostgREST returns a single object when a question has exactly one related option row. */
function optionsArrayFromEmbed(raw: unknown): GameOptionRow[] {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw as GameOptionRow[]
  return [raw as GameOptionRow]
}

export async function GET() {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ ok: false, error: supabaseMissingEnvMessage() }, { status: 503 })
  }

  const { data: rows, error } = await admin
    .from("questions")
    .select(
      `
      id,
      order_index,
      question_text,
      options (
        id,
        option_key,
        option_text,
        weight_react,
        weight_trust,
        weight_indep,
        weight_adapt,
        weight_mobil,
        weight_safety
      )
    `
    )
    .order("order_index", { ascending: true })

  if (error) {
    console.error("[game/questions]", error.message)
    return NextResponse.json({ ok: false, error: "Failed to load questions" }, { status: 500 })
  }

  const questions: GameQuestionRow[] = (rows ?? []).map((row: Record<string, unknown>) => {
    const rawOpts = optionsArrayFromEmbed(row.options)
    const options = [...rawOpts].sort((a, b) => String(a.option_key).localeCompare(String(b.option_key)))
    return {
      id: row.id as string,
      order_index: row.order_index as number,
      question_text: row.question_text as string,
      options,
    }
  })

  return NextResponse.json({ ok: true, questions })
}
