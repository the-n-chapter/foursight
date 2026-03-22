import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveFinnishMunicipality } from "@/lib/finnish-municipality"
import { parseValidAge } from "@/lib/parse-age"
import { getSupabaseAdmin, supabaseMissingEnvMessage } from "@/lib/supabase/admin"

const bodySchema = z.object({
  sessionToken: z.string().min(8).max(200),
  nickname: z.string().max(200),
  age: z
    .string()
    .min(1)
    .max(32)
    .refine((s) => parseValidAge(s) !== null, "Age must be a whole number between 1 and 120"),
  gender: z.enum(["female", "male", "other"]),
  municipality: z.string().min(1).max(200),
  has_children: z.boolean(),
  has_elderly: z.boolean(),
  has_pets: z.boolean(),
})

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
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 })
  }

  const p = parsed.data
  const nickname = p.nickname.trim() || "Anonymous"
  const municipality = resolveFinnishMunicipality(p.municipality)
  if (!municipality) {
    return NextResponse.json(
      { ok: false, error: "Choose a valid Finnish municipality from the suggestions." },
      { status: 400 }
    )
  }

  const { data: existing, error: selErr } = await admin
    .from("players")
    .select("id")
    .eq("session_token", p.sessionToken)
    .maybeSingle()

  if (selErr) {
    console.error("[game/player] select", selErr.message)
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 })
  }

  const row = {
    nickname,
    age: p.age,
    gender: p.gender,
    municipality,
    has_children: p.has_children,
    has_elderly: p.has_elderly,
    has_pets: p.has_pets,
  }

  if (existing?.id) {
    const { error: upErr } = await admin.from("players").update(row).eq("id", existing.id)
    if (upErr) {
      console.error("[game/player] update", upErr.message)
      return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 })
    }
    return NextResponse.json({ ok: true, playerId: existing.id })
  }

  const id = randomUUID()
  const { error: insErr } = await admin.from("players").insert({
    id,
    session_token: p.sessionToken,
    ...row,
  })

  if (insErr) {
    console.error("[game/player] insert", insErr.message)
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, playerId: id })
}
