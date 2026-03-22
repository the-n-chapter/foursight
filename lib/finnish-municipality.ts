import FINNISH_MUNICIPALITIES from "@/lib/data/finnish-municipalities.json"

export { FINNISH_MUNICIPALITIES }

/** Case-insensitive + accent-aware match; returns the canonical list spelling. */
export function resolveFinnishMunicipality(input: string): string | null {
  const v = input.trim()
  if (!v) return null
  const lower = v.toLocaleLowerCase("fi")
  const byLower = FINNISH_MUNICIPALITIES.find((n) => n.toLocaleLowerCase("fi") === lower)
  if (byLower) return byLower
  return (
    FINNISH_MUNICIPALITIES.find((n) => n.localeCompare(v, "fi", { sensitivity: "accent" }) === 0) ?? null
  )
}

export function filterFinnishMunicipalities(query: string, limit = 12): string[] {
  const q = query.trim().toLocaleLowerCase("fi")
  if (!q) return [...FINNISH_MUNICIPALITIES].slice(0, limit)
  return FINNISH_MUNICIPALITIES.filter((n) => n.toLocaleLowerCase("fi").includes(q)).slice(0, limit)
}
