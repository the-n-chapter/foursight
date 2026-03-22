import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin, supabaseMissingEnvMessage } from "@/lib/supabase/admin"

const decisionSchema = z
  .object({
    questionId: z.string().uuid(),
    optionId: z.string().uuid().optional(),
    otherText: z.string().max(2000).optional(),
  })
  .superRefine((d, ctx) => {
    const hasOpt = !!d.optionId
    const hasOther = !!(d.otherText && d.otherText.trim())
    if (hasOpt === hasOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide exactly one of optionId or non-empty otherText",
      })
    }
  })

const bodySchema = z.object({
  sessionToken: z.string().min(8).max(200),
  decisions: z.array(decisionSchema).min(1),
})

function optionLetterForOtherOptionCount(optionCount: number): string {
  return String.fromCharCode("A".charCodeAt(0) + optionCount)
}

export async function POST(req: Request) {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ ok: false, error: supabaseMissingEnvMessage() }, { status: 503 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success || parsed.data.decisions.length === 0) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 })
  }

  const { sessionToken, decisions } = parsed.data

  const { data: player, error: pErr } = await admin
    .from("players")
    .select("id")
    .eq("session_token", sessionToken)
    .maybeSingle()

  if (pErr || !player?.id) {
    return NextResponse.json({ ok: false, error: "Player not found for session" }, { status: 404 })
  }

  const playerId = player.id as string

  const optionDecisions = decisions.filter((d): d is { questionId: string; optionId: string } => !!d.optionId)
  const otherDecisions = decisions.filter(
    (d): d is { questionId: string; otherText: string } => !!(d.otherText && d.otherText.trim())
  )

  const optionIds = [...new Set(optionDecisions.map((d) => d.optionId))]
  let optionsRows: {
    id: string
    question_id: string
    option_key: string
    weight_react: number | null
    weight_trust: number | null
    weight_indep: number | null
    weight_adapt: number | null
    weight_mobil: number | null
    weight_safety: number | null
  }[] = []

  if (optionIds.length > 0) {
    const { data: rows, error: oErr } = await admin
      .from("options")
      .select(
        "id, question_id, option_key, weight_react, weight_trust, weight_indep, weight_adapt, weight_mobil, weight_safety"
      )
      .in("id", optionIds)

    if (oErr || !rows?.length) {
      console.error("[game/submit] options", oErr?.message)
      return NextResponse.json({ ok: false, error: "Could not load options" }, { status: 500 })
    }
    optionsRows = rows as typeof optionsRows
  }

  const byOptionId = new Map(optionsRows.map((r) => [r.id, r]))

  for (const d of optionDecisions) {
    const opt = byOptionId.get(d.optionId)
    if (!opt || opt.question_id !== d.questionId) {
      return NextResponse.json({ ok: false, error: "Invalid question/option pair" }, { status: 400 })
    }
  }

  const otherQuestionIds = [...new Set(otherDecisions.map((d) => d.questionId))]
  let optionCountByQuestion = new Map<string, number>()

  if (otherQuestionIds.length > 0) {
    const { data: countRows, error: cErr } = await admin
      .from("options")
      .select("question_id")
      .in("question_id", otherQuestionIds)

    if (cErr || !countRows?.length) {
      console.error("[game/submit] option counts", cErr?.message)
      return NextResponse.json({ ok: false, error: "Could not validate questions" }, { status: 500 })
    }

    optionCountByQuestion = new Map<string, number>()
    for (const row of countRows) {
      const qid = row.question_id as string
      optionCountByQuestion.set(qid, (optionCountByQuestion.get(qid) ?? 0) + 1)
    }

    for (const qid of otherQuestionIds) {
      const n = optionCountByQuestion.get(qid) ?? 0
      if (n < 1) {
        return NextResponse.json({ ok: false, error: "Invalid question for other answer" }, { status: 400 })
      }
    }
  }

  const { error: delErr } = await admin.from("decisions").delete().eq("player_id", playerId)
  if (delErr) {
    console.error("[game/submit] delete", delErr.message)
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 })
  }

  const zeroScores = {
    score_react: 0,
    score_trust: 0,
    score_indep: 0,
    score_adapt: 0,
    score_mobil: 0,
    score_safety: 0,
  }

  const insertsFromOptions = optionDecisions.map((d) => {
    const opt = byOptionId.get(d.optionId)!
    return {
      id: randomUUID(),
      player_id: playerId,
      question_id: d.questionId,
      option_chosen: opt.option_key,
      is_other: false,
      other_text: null as string | null,
      reaction_time_ms: null as number | null,
      score_react: opt.weight_react ?? 0,
      score_trust: opt.weight_trust ?? 0,
      score_indep: opt.weight_indep ?? 0,
      score_adapt: opt.weight_adapt ?? 0,
      score_mobil: opt.weight_mobil ?? 0,
      score_safety: opt.weight_safety ?? 0,
    }
  })

  const insertsFromOther = otherDecisions.map((d) => {
    const n = optionCountByQuestion.get(d.questionId) ?? 0
    const letter = optionLetterForOtherOptionCount(n)
    return {
      id: randomUUID(),
      player_id: playerId,
      question_id: d.questionId,
      option_chosen: letter,
      is_other: true,
      other_text: d.otherText.trim(),
      reaction_time_ms: null as number | null,
      ...zeroScores,
    }
  })

  const inserts = [...insertsFromOptions, ...insertsFromOther]

  const { error: insErr } = await admin.from("decisions").insert(inserts)
  if (insErr) {
    console.error("[game/submit] insert", insErr.message)
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
