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
  outerGradient: "from-zinc-500/35 via-zinc-500/14 to-transparent",
  faceBorder: "border-zinc-400/35 dark:border-zinc-500/40",
  topLineGradient: "from-transparent via-zinc-500/65 to-transparent",
  headerGradient:
    "from-zinc-500/[0.14] via-zinc-500/[0.06] to-transparent dark:from-zinc-500/20 dark:via-zinc-500/10 dark:to-zinc-950/25",
  sectionBar: "bg-zinc-500/85 dark:bg-zinc-400/75",
  crisisBullet: "bg-zinc-500 dark:bg-zinc-400",
  crisisBulletRing: "ring-zinc-500/30 dark:ring-zinc-400/35",
  flipBorder: "border-zinc-400/35 dark:border-zinc-500/40",
  flipBg: "bg-zinc-500/[0.06] dark:bg-zinc-500/12",
  focusRing: "focus-visible:ring-zinc-400/45",
}

const ACCENTS: Record<DimensionKey, PersonalityAccent> = {
  react: {
    outerGradient: "from-rose-500/35 via-rose-500/12 to-transparent",
    faceBorder: "border-rose-500/25 dark:border-rose-400/30",
    topLineGradient: "from-transparent via-rose-500/70 to-transparent",
    headerGradient:
      "from-rose-500/[0.16] via-rose-500/[0.07] to-transparent dark:from-rose-500/22 dark:via-rose-500/11 dark:to-rose-950/20",
    sectionBar: "bg-rose-500/85 dark:bg-rose-400/80",
    crisisBullet: "bg-rose-500 dark:bg-rose-400",
    crisisBulletRing: "ring-rose-500/30 dark:ring-rose-400/35",
    flipBorder: "border-rose-500/30 dark:border-rose-400/35",
    flipBg: "bg-rose-500/[0.07] dark:bg-rose-500/14",
    focusRing: "focus-visible:ring-rose-400/45",
  },
  trust: {
    outerGradient: "from-violet-500/35 via-violet-500/12 to-transparent",
    faceBorder: "border-violet-500/25 dark:border-violet-400/30",
    topLineGradient: "from-transparent via-violet-500/70 to-transparent",
    headerGradient:
      "from-violet-500/[0.16] via-violet-500/[0.07] to-transparent dark:from-violet-500/22 dark:via-violet-500/11 dark:to-violet-950/20",
    sectionBar: "bg-violet-500/85 dark:bg-violet-400/80",
    crisisBullet: "bg-violet-500 dark:bg-violet-400",
    crisisBulletRing: "ring-violet-500/30 dark:ring-violet-400/35",
    flipBorder: "border-violet-500/30 dark:border-violet-400/35",
    flipBg: "bg-violet-500/[0.07] dark:bg-violet-500/14",
    focusRing: "focus-visible:ring-violet-400/45",
  },
  indep: {
    outerGradient: "from-orange-500/42 via-orange-500/18 to-transparent",
    faceBorder: "border-orange-500/35 dark:border-orange-400/38",
    topLineGradient: "from-transparent via-orange-500/80 to-transparent",
    headerGradient:
      "from-orange-500/[0.22] via-orange-500/[0.11] to-transparent dark:from-orange-500/30 dark:via-orange-500/15 dark:to-orange-950/30",
    sectionBar: "bg-orange-600/88 dark:bg-orange-400/82",
    crisisBullet: "bg-orange-600 dark:bg-orange-400",
    crisisBulletRing: "ring-orange-500/38 dark:ring-orange-400/42",
    flipBorder: "border-orange-500/38 dark:border-orange-400/42",
    flipBg: "bg-orange-500/[0.1] dark:bg-orange-500/18",
    focusRing: "focus-visible:ring-orange-400/50",
  },
  adapt: {
    outerGradient: "from-emerald-500/35 via-emerald-500/12 to-transparent",
    faceBorder: "border-emerald-500/25 dark:border-emerald-400/30",
    topLineGradient: "from-transparent via-emerald-500/70 to-transparent",
    headerGradient:
      "from-emerald-500/[0.16] via-emerald-500/[0.07] to-transparent dark:from-emerald-500/22 dark:via-emerald-500/11 dark:to-emerald-950/20",
    sectionBar: "bg-emerald-500/85 dark:bg-emerald-400/80",
    crisisBullet: "bg-emerald-500 dark:bg-emerald-400",
    crisisBulletRing: "ring-emerald-500/30 dark:ring-emerald-400/35",
    flipBorder: "border-emerald-500/30 dark:border-emerald-400/35",
    flipBg: "bg-emerald-500/[0.07] dark:bg-emerald-500/14",
    focusRing: "focus-visible:ring-emerald-400/45",
  },
  mobil: {
    outerGradient: "from-yellow-500/40 via-yellow-500/15 to-transparent",
    faceBorder: "border-yellow-500/30 dark:border-yellow-400/35",
    topLineGradient: "from-transparent via-yellow-600/70 to-transparent",
    headerGradient:
      "from-yellow-500/[0.2] via-yellow-500/[0.09] to-transparent dark:from-yellow-500/24 dark:via-yellow-500/12 dark:to-yellow-950/25",
    sectionBar: "bg-yellow-600/90 dark:bg-yellow-400/85",
    crisisBullet: "bg-yellow-600 dark:bg-yellow-400",
    crisisBulletRing: "ring-yellow-600/35 dark:ring-yellow-400/40",
    flipBorder: "border-yellow-500/35 dark:border-yellow-400/40",
    flipBg: "bg-yellow-500/[0.09] dark:bg-yellow-500/16",
    focusRing: "focus-visible:ring-yellow-500/50 dark:focus-visible:ring-yellow-400/45",
  },
  safety: {
    outerGradient: "from-sky-500/35 via-sky-500/12 to-transparent",
    faceBorder: "border-sky-500/25 dark:border-sky-400/30",
    topLineGradient: "from-transparent via-sky-500/70 to-transparent",
    headerGradient:
      "from-sky-500/[0.16] via-sky-500/[0.07] to-transparent dark:from-sky-500/22 dark:via-sky-500/11 dark:to-sky-950/20",
    sectionBar: "bg-sky-500/85 dark:bg-sky-400/80",
    crisisBullet: "bg-sky-500 dark:bg-sky-400",
    crisisBulletRing: "ring-sky-500/30 dark:ring-sky-400/35",
    flipBorder: "border-sky-500/30 dark:border-sky-400/35",
    flipBg: "bg-sky-500/[0.07] dark:bg-sky-500/14",
    focusRing: "focus-visible:ring-sky-400/45",
  },
}

export function getPersonalityAccent(dimension: PersonalityDimension): PersonalityAccent {
  if (dimension === "unpredictable") return UNPREDICTABLE_ACCENT
  return ACCENTS[dimension]
}
