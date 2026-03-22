/** Valid whole-number age for the profile (years). */
export function parseValidAge(raw: string): number | null {
  const t = raw.trim()
  if (!t || !/^\d+$/.test(t)) return null
  const n = Number.parseInt(t, 10)
  if (!Number.isInteger(n) || n < 1 || n > 120) return null
  return n
}
