export type DecisionPayload =
  | { questionId: string; optionId: string; otherText?: undefined }
  | { questionId: string; otherText: string; optionId?: undefined }

export async function submitGameDecisions(
  sessionToken: string,
  decisions: DecisionPayload[]
): Promise<{ ok: boolean; error?: string }> {
  if (!sessionToken || decisions.length === 0) {
    return { ok: false, error: "Missing session or decisions" }
  }

  const res = await fetch("/api/game/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken, decisions }),
  })

  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }

  if (!res.ok) {
    return { ok: false, error: data.error ?? `HTTP ${res.status}` }
  }

  return { ok: !!data.ok }
}
