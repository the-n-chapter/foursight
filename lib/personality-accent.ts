import type { PersonalityDimension } from "@/lib/personality-cards"
import type { DimensionKey } from "@/lib/dimension-scoring"

/** Tailwind classes for archetype-specific accents (light + dark). */
export interface PersonalityAccent {
  /** Outer gradient ring (button wrapper) */
  outerGradient: string
  /** Card face border */
  faceBorder: string
  /** Top hairline gradient (Tailwind stops after `bg-gradient-to-r`) */
  topLineGradient: string
  /** CardHeader background gradient */
  headerGradient: string
  /** Description / Crisis tips vertical bar */
  sectionBar: string
  /** Crisis tip list bullet */
  crisisBullet: string
  crisisBulletRing: string
  /** Flip hint strip */
  flipBorder: string
  flipBg: string
  /** Focus ring on card tap target */
  focusRing: string
}

const UNPREDICTABLE_ACCENT: PersonalityAccent = {
  outerGradient: "bg-zinc-300",
  faceBorder: "border-zinc-400/35 dark:border-zinc-500/40",
  topLineGradient: "bg-zinc-500/65",
  headerGradient: "bg-zinc-300",
  sectionBar: "bg-zinc-500/85 dark:bg-zinc-400/75",
  crisisBullet: "bg-zinc-500 dark:bg-zinc-400",
  crisisBulletRing: "ring-zinc-500/30 dark:ring-zinc-400/35",
  flipBorder: "border-zinc-400/35 dark:border-zinc-500/40",
  flipBg: "bg-zinc-500/[0.06] dark:bg-zinc-500/12",
  focusRing: "focus-visible:ring-zinc-400/45",
}

const ACCENTS: Record<DimensionKey, PersonalityAccent> = {
  react: {
    outerGradient: "bg-[#FF4D6D]",
    faceBorder: "border-[#FF4D6D]/80 dark:border-[#FF4D6D]/75",
    topLineGradient: "bg-[#FF4D6D]",
    headerGradient: "bg-[#FF4D6D]/35",
    sectionBar: "bg-[#FF4D6D]",
    crisisBullet: "bg-[#FF4D6D]",
    crisisBulletRing: "ring-[#FF4D6D]/50",
    flipBorder: "border-[#FF4D6D]/60 dark:border-[#FF4D6D]/55",
    flipBg: "bg-[#FF4D6D]/18 dark:bg-[#FF4D6D]/24",
    focusRing: "focus-visible:ring-[#FF4D6D]/60",
  },
  trust: {
    outerGradient: "bg-[#7B61FF]",
    faceBorder: "border-[#7B61FF]/80 dark:border-[#7B61FF]/75",
    topLineGradient: "bg-[#7B61FF]",
    headerGradient: "bg-[#7B61FF]/35",
    sectionBar: "bg-[#7B61FF]",
    crisisBullet: "bg-[#7B61FF]",
    crisisBulletRing: "ring-[#7B61FF]/50",
    flipBorder: "border-[#7B61FF]/60 dark:border-[#7B61FF]/55",
    flipBg: "bg-[#7B61FF]/18 dark:bg-[#7B61FF]/24",
    focusRing: "focus-visible:ring-[#7B61FF]/60",
  },
  indep: {
    outerGradient: "bg-[#FF7A00]",
    faceBorder: "border-[#FF7A00]/80 dark:border-[#FF7A00]/75",
    topLineGradient: "bg-[#FF7A00]",
    headerGradient: "bg-[#FF7A00]/35",
    sectionBar: "bg-[#FF7A00]",
    crisisBullet: "bg-[#FF7A00]",
    crisisBulletRing: "ring-[#FF7A00]/50",
    flipBorder: "border-[#FF7A00]/60 dark:border-[#FF7A00]/55",
    flipBg: "bg-[#FF7A00]/18 dark:bg-[#FF7A00]/24",
    focusRing: "focus-visible:ring-[#FF7A00]/60",
  },
  adapt: {
    outerGradient: "bg-[#00C853]",
    faceBorder: "border-[#00C853]/80 dark:border-[#00C853]/75",
    topLineGradient: "bg-[#00C853]",
    headerGradient: "bg-[#00C853]/35",
    sectionBar: "bg-[#00C853]",
    crisisBullet: "bg-[#00C853]",
    crisisBulletRing: "ring-[#00C853]/50",
    flipBorder: "border-[#00C853]/60 dark:border-[#00C853]/55",
    flipBg: "bg-[#00C853]/18 dark:bg-[#00C853]/24",
    focusRing: "focus-visible:ring-[#00C853]/60",
  },
  mobil: {
    outerGradient: "bg-[#FFD400]",
    faceBorder: "border-[#FFD400]/80 dark:border-[#FFD400]/75",
    topLineGradient: "bg-[#FFD400]",
    headerGradient: "bg-[#FFD400]/35",
    sectionBar: "bg-[#FFD400]",
    crisisBullet: "bg-[#FFD400]",
    crisisBulletRing: "ring-[#FFD400]/50",
    flipBorder: "border-[#FFD400]/60 dark:border-[#FFD400]/55",
    flipBg: "bg-[#FFD400]/18 dark:bg-[#FFD400]/24",
    focusRing: "focus-visible:ring-[#FFD400]/60",
  },
  safety: {
    outerGradient: "bg-[#00B8D9]",
    faceBorder: "border-[#00B8D9]/80 dark:border-[#00B8D9]/75",
    topLineGradient: "bg-[#00B8D9]",
    headerGradient: "bg-[#00B8D9]/35",
    sectionBar: "bg-[#00B8D9]",
    crisisBullet: "bg-[#00B8D9]",
    crisisBulletRing: "ring-[#00B8D9]/50",
    flipBorder: "border-[#00B8D9]/60 dark:border-[#00B8D9]/55",
    flipBg: "bg-[#00B8D9]/18 dark:bg-[#00B8D9]/24",
    focusRing: "focus-visible:ring-[#00B8D9]/60",
  },
  commu: {
    outerGradient: "bg-[#E040FB]",
    faceBorder: "border-[#E040FB]/80 dark:border-[#E040FB]/75",
    topLineGradient: "bg-[#E040FB]",
    headerGradient: "bg-[#E040FB]/35",
    sectionBar: "bg-[#E040FB]",
    crisisBullet: "bg-[#E040FB]",
    crisisBulletRing: "ring-[#E040FB]/50",
    flipBorder: "border-[#E040FB]/60 dark:border-[#E040FB]/55",
    flipBg: "bg-[#E040FB]/18 dark:bg-[#E040FB]/24",
    focusRing: "focus-visible:ring-[#E040FB]/60",
  },
  prep: {
    outerGradient: "bg-[#4E342E]",
    faceBorder: "border-[#4E342E]/80 dark:border-[#4E342E]/75",
    topLineGradient: "bg-[#4E342E]",
    headerGradient: "bg-[#4E342E]/35",
    sectionBar: "bg-[#4E342E]",
    crisisBullet: "bg-[#4E342E]",
    crisisBulletRing: "ring-[#4E342E]/50",
    flipBorder: "border-[#4E342E]/60 dark:border-[#4E342E]/55",
    flipBg: "bg-[#4E342E]/18 dark:bg-[#4E342E]/24",
    focusRing: "focus-visible:ring-[#4E342E]/60",
  },
}

export function getPersonalityAccent(dimension: PersonalityDimension): PersonalityAccent {
  if (dimension === "unpredictable") return UNPREDICTABLE_ACCENT
  return ACCENTS[dimension]
}
