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
    outerGradient: "from-[#FF6B6B]/80 via-[#FF6B6B]/35 to-transparent",
    faceBorder: "border-[#FF6B6B]/75 dark:border-[#FF6B6B]/70",
    topLineGradient: "from-transparent via-[#FF6B6B] to-transparent",
    headerGradient:
      "from-[#FF6B6B]/45 via-[#FF6B6B]/22 to-transparent dark:from-[#FF6B6B]/40 dark:via-[#FF6B6B]/22 dark:to-black/25",
    sectionBar: "bg-[#FF6B6B]",
    crisisBullet: "bg-[#FF6B6B]",
    crisisBulletRing: "ring-[#FF6B6B]/45",
    flipBorder: "border-[#FF6B6B]/55 dark:border-[#FF6B6B]/45",
    flipBg: "bg-[#FF6B6B]/15 dark:bg-[#FF6B6B]/20",
    focusRing: "focus-visible:ring-[#FF6B6B]/55",
  },
  trust: {
    outerGradient: "from-[#C4A1FF]/80 via-[#C4A1FF]/35 to-transparent",
    faceBorder: "border-[#C4A1FF]/75 dark:border-[#C4A1FF]/70",
    topLineGradient: "from-transparent via-[#C4A1FF] to-transparent",
    headerGradient:
      "from-[#C4A1FF]/45 via-[#C4A1FF]/22 to-transparent dark:from-[#C4A1FF]/40 dark:via-[#C4A1FF]/22 dark:to-black/25",
    sectionBar: "bg-[#C4A1FF]",
    crisisBullet: "bg-[#C4A1FF]",
    crisisBulletRing: "ring-[#C4A1FF]/45",
    flipBorder: "border-[#C4A1FF]/55 dark:border-[#C4A1FF]/45",
    flipBg: "bg-[#C4A1FF]/15 dark:bg-[#C4A1FF]/20",
    focusRing: "focus-visible:ring-[#C4A1FF]/55",
  },
  indep: {
    outerGradient: "from-[#FFA07A]/80 via-[#FFA07A]/35 to-transparent",
    faceBorder: "border-[#FFA07A]/75 dark:border-[#FFA07A]/70",
    topLineGradient: "from-transparent via-[#FFA07A] to-transparent",
    headerGradient:
      "from-[#FFA07A]/45 via-[#FFA07A]/22 to-transparent dark:from-[#FFA07A]/40 dark:via-[#FFA07A]/22 dark:to-black/25",
    sectionBar: "bg-[#FFA07A]",
    crisisBullet: "bg-[#FFA07A]",
    crisisBulletRing: "ring-[#FFA07A]/45",
    flipBorder: "border-[#FFA07A]/55 dark:border-[#FFA07A]/45",
    flipBg: "bg-[#FFA07A]/15 dark:bg-[#FFA07A]/20",
    focusRing: "focus-visible:ring-[#FFA07A]/55",
  },
  adapt: {
    outerGradient: "from-[#90EE90]/80 via-[#90EE90]/35 to-transparent",
    faceBorder: "border-[#90EE90]/75 dark:border-[#90EE90]/70",
    topLineGradient: "from-transparent via-[#90EE90] to-transparent",
    headerGradient:
      "from-[#90EE90]/45 via-[#90EE90]/22 to-transparent dark:from-[#90EE90]/40 dark:via-[#90EE90]/22 dark:to-black/25",
    sectionBar: "bg-[#90EE90]",
    crisisBullet: "bg-[#90EE90]",
    crisisBulletRing: "ring-[#90EE90]/45",
    flipBorder: "border-[#90EE90]/55 dark:border-[#90EE90]/45",
    flipBg: "bg-[#90EE90]/15 dark:bg-[#90EE90]/20",
    focusRing: "focus-visible:ring-[#90EE90]/55",
  },
  mobil: {
    outerGradient: "from-[#F4D738]/80 via-[#F4D738]/35 to-transparent",
    faceBorder: "border-[#F4D738]/75 dark:border-[#F4D738]/70",
    topLineGradient: "from-transparent via-[#F4D738] to-transparent",
    headerGradient:
      "from-[#F4D738]/45 via-[#F4D738]/22 to-transparent dark:from-[#F4D738]/40 dark:via-[#F4D738]/22 dark:to-black/25",
    sectionBar: "bg-[#F4D738]",
    crisisBullet: "bg-[#F4D738]",
    crisisBulletRing: "ring-[#F4D738]/45",
    flipBorder: "border-[#F4D738]/55 dark:border-[#F4D738]/45",
    flipBg: "bg-[#F4D738]/15 dark:bg-[#F4D738]/20",
    focusRing: "focus-visible:ring-[#F4D738]/55",
  },
  safety: {
    outerGradient: "from-[#87CEEB]/80 via-[#87CEEB]/35 to-transparent",
    faceBorder: "border-[#87CEEB]/75 dark:border-[#87CEEB]/70",
    topLineGradient: "from-transparent via-[#87CEEB] to-transparent",
    headerGradient:
      "from-[#87CEEB]/45 via-[#87CEEB]/22 to-transparent dark:from-[#87CEEB]/40 dark:via-[#87CEEB]/22 dark:to-black/25",
    sectionBar: "bg-[#87CEEB]",
    crisisBullet: "bg-[#87CEEB]",
    crisisBulletRing: "ring-[#87CEEB]/45",
    flipBorder: "border-[#87CEEB]/55 dark:border-[#87CEEB]/45",
    flipBg: "bg-[#87CEEB]/15 dark:bg-[#87CEEB]/20",
    focusRing: "focus-visible:ring-[#87CEEB]/55",
  },
  commu: {
    outerGradient: "from-[#69D2E7]/80 via-[#69D2E7]/35 to-transparent",
    faceBorder: "border-[#69D2E7]/75 dark:border-[#69D2E7]/70",
    topLineGradient: "from-transparent via-[#69D2E7] to-transparent",
    headerGradient:
      "from-[#69D2E7]/45 via-[#69D2E7]/22 to-transparent dark:from-[#69D2E7]/40 dark:via-[#69D2E7]/22 dark:to-black/25",
    sectionBar: "bg-[#69D2E7]",
    crisisBullet: "bg-[#69D2E7]",
    crisisBulletRing: "ring-[#69D2E7]/45",
    flipBorder: "border-[#69D2E7]/55 dark:border-[#69D2E7]/45",
    flipBg: "bg-[#69D2E7]/15 dark:bg-[#69D2E7]/20",
    focusRing: "focus-visible:ring-[#69D2E7]/55",
  },
  prep: {
    outerGradient: "from-[#A388EE]/80 via-[#A388EE]/35 to-transparent",
    faceBorder: "border-[#A388EE]/75 dark:border-[#A388EE]/70",
    topLineGradient: "from-transparent via-[#A388EE] to-transparent",
    headerGradient:
      "from-[#A388EE]/45 via-[#A388EE]/22 to-transparent dark:from-[#A388EE]/40 dark:via-[#A388EE]/22 dark:to-black/25",
    sectionBar: "bg-[#A388EE]",
    crisisBullet: "bg-[#A388EE]",
    crisisBulletRing: "ring-[#A388EE]/45",
    flipBorder: "border-[#A388EE]/55 dark:border-[#A388EE]/45",
    flipBg: "bg-[#A388EE]/15 dark:bg-[#A388EE]/20",
    focusRing: "focus-visible:ring-[#A388EE]/55",
  },
}

export function getPersonalityAccent(dimension: PersonalityDimension): PersonalityAccent {
  if (dimension === "unpredictable") return UNPREDICTABLE_ACCENT
  return ACCENTS[dimension]
}
