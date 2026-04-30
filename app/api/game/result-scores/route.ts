import { NextResponse } from "next/server"
import { normalizedDominantFromDecisions } from "@/lib/dominant-dimension"
import type { DimensionKey } from "@/lib/dimension-scoring"
import { getSupabaseAdmin, supabaseMissingEnvMessage } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ ok: false, error: supabaseMissingEnvMessage() }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const sessionToken = searchParams.get("sessionToken")?.trim()
  if (!sessionToken) {
    return NextResponse.json({ ok: false, error: "Missing sessionToken" }, { status: 400 })
  }

  const { data: player, error: pErr } = await admin
    .from("players")
    .select("id")
    .eq("session_token", sessionToken)
    .maybeSingle()

  if (pErr || !player?.id) {
    return NextResponse.json({ ok: false, error: "Player not found" }, { status: 404 })
  }

  const playerId = player.id as string

  const { data: rows, error: dErr } = await admin
    .from("decisions")
    .select("question_id, score_react, score_trust, score_indep, score_adapt, score_mobil, score_safety, score_commu, score_prep")
    .eq("player_id", playerId)

  if (dErr) {
    console.error("[result-scores]", dErr.message)
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 })
  }

  if (!rows?.length) {
    return NextResponse.json({ ok: false, error: "No decisions found for this session" }, { status: 404 })
  }

  const questionIds = [...new Set(rows.map((r) => r.question_id))]
  const { data: optionRows, error: oErr } = await admin
    .from("options")
    .select(
      "question_id, weight_react, weight_trust, weight_indep, weight_adapt, weight_mobil, weight_safety, weight_commu, weight_prep"
    )
    .in("question_id", questionIds)

  if (oErr || !optionRows?.length) {
    console.error("[result-scores/options]", oErr?.message)
    return NextResponse.json({ ok: false, error: "Could not load option ranges" }, { status: 500 })
  }

  const computed = normalizedDominantFromDecisions(rows, optionRows)
  if (!computed) {
    return NextResponse.json({ ok: false, error: "Could not compute scores" }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    averages: computed.averages,
    dominant: computed.dominant as DimensionKey,
    decisionCount: rows.length,
  })
}
