import type { DimensionKey } from "@/lib/dimension-scoring"

/** Six scored archetypes plus the free-text-only “Unpredictable” card. */
export type PersonalityDimension = DimensionKey | "unpredictable"

export interface PersonalityCard {
  dimension: PersonalityDimension
  /** Uppercase label (REACT, …) — e.g. dimension wiki / tooling */
  dimensionLabel: string
  title: string
  /** Used in the opening line: "<nickname>, you are {youAreName}." */
  youAreName: string
  description: string
  crisisTips: string[]
}

export const PERSONALITY_BY_DIMENSION: Record<DimensionKey, PersonalityCard> = {
  react: {
    dimension: "react",
    dimensionLabel: "REACT",
    title: "The Quickstarter",
    youAreName: "The Quickstarter",
    description:
      "You're the first to notice danger and the first to act. You move fast, trust your gut, and rarely wait for someone else to take charge. You're the spark that gets everyone going.",
    crisisTips: [
      "Trust your instincts, but double-check critical info.",
      "Focus on immediate threats first, don't let speed make you reckless.",
      "Keep your team in the loop so no one gets left behind.",
    ],
  },
  trust: {
    dimension: "trust",
    dimensionLabel: "TRUST",
    title: "The Guided Follower",
    youAreName: "The Guided Follower",
    description:
      "You shine when you have clear instructions. Rules, plans, and guidance make you feel confident. You're reliable, calm, and make sure everything is done right. Others can count on you to follow through.",
    crisisTips: [
      "Stick to the plan as it's your superpower.",
      "Be ready to improvise a little if instructions aren't available.",
      "Help others stay organized when chaos hits.",
    ],
  },
  indep: {
    dimension: "indep",
    dimensionLabel: "INDEPEND",
    title: "The Independent Thinker",
    youAreName: "The Independent Thinker",
    description:
      "You trust yourself above all else. Rules and plans are nice, but you prefer figuring things out on your own. You're creative, resourceful, and never shy away from taking responsibility.",
    crisisTips: [
      "Use your instincts, but take a moment to check key info.",
      "Don't go it completely alone, but share updates with others for safety.",
      "Your independence is powerful, just pair it with a bit of teamwork.",
    ],
  },
  adapt: {
    dimension: "adapt",
    dimensionLabel: "ADAPT",
    title: "The Flexible Adapter",
    youAreName: "The Flexible Adapter",
    description:
      "When everything changes, you don't panic but adjust. You're calm, clever, and quick to find a solution when plans go sideways. Flexibility is your superpower in unpredictable situations.",
    crisisTips: [
      "Embrace change, but don't ignore safety rules.",
      "Bridge the gap between fast movers and cautious thinkers.",
      "Keep solutions simple and practical.",
    ],
  },
  mobil: {
    dimension: "mobil",
    dimensionLabel: "MOBILITY",
    title: "The Go-Getter",
    youAreName: "The Go-Getter",
    description:
      "Action is your middle name. You see what needs doing and jump right in. You're ready to move immediately and cover long distances if needed. Your energy motivates everyone around you, and you're always ready to tackle the next challenge.",
    crisisTips: [
      "Take the lead on urgent tasks and be ready to relocate quickly.",
      "Check safety before acting because moving fast doesn't mean ignoring risks.",
      "Coordinate with planners and adapters to make your mobility most effective.",
    ],
  },
  safety: {
    dimension: "safety",
    dimensionLabel: "SAFETY",
    title: "The Safety Seeker",
    youAreName: "The Safety Seeker",
    description:
      "You're all about thinking ahead. Safety, preparation, and careful choices come first. You notice risks others overlook and make sure the team is ready for anything.",
    crisisTips: [
      "Prepare early and keep your options open.",
      "Communicate risks clearly: others need your insight.",
      "Don't get stuck overthinking: sometimes it's okay to act with the info you have.",
    ],
  },
}

export const UNPREDICTABLE_PERSONALITY_CARD: PersonalityCard = {
  dimension: "unpredictable",
  dimensionLabel: "UNPREDICTABLE",
  title: "The Unpredictable",
  youAreName: "The Unpredictable",
  description:
    "You are the wild card. Your responses do not yet match a clear pattern. For now, you are placed in The Unpredictable type while we continue to learn more about different crisis behaviors.",
  crisisTips: [],
}

export function getPersonalityCard(key: DimensionKey): PersonalityCard {
  return PERSONALITY_BY_DIMENSION[key]
}
