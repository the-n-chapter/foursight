import type { PersonalityDimension } from "@/lib/personality-cards"
import type { DimensionKey } from "@/lib/dimension-scoring"

export interface PersonalityTraits {
  catchphrase: string
  likes: string
  dislikes: string
  goodMatch: string
  badMatch: string
  strengths: string
  weaknesses: string
}

export const PERSONALITY_TRAITS_BY_DIMENSION: Record<DimensionKey, PersonalityTraits> = {
  react: {
    catchphrase: "First come, first served.",
    likes: "Fast changes, quick action, speed, and solving things immediately.",
    dislikes: "Being told to slow down, waiting, indecisiveness, and delays.",
    goodMatch: "The Guided Follower / The Cautious Survivor",
    badMatch: "The Independent Pathfinder",
    strengths: "Energetic nature, fast decision-making, taking initiative, and acting while others freeze.",
    weaknesses: "Acting without thinking, overreacting, skipping details, and rushing others.",
  },
  trust: {
    catchphrase: "Walking with the wise.",
    likes: "Clear instructions, trusted leaders, organized plans, and official guidance.",
    dislikes: "Conflicting advice, chaos, misinformation, and uncertainty.",
    goodMatch: "The Decisive Catalyst / The Cautious Survivor",
    badMatch: "The Independent Pathfinder",
    strengths: "Cooperative and dependable nature, calmness under structure, and following safe guidance.",
    weaknesses: "Waiting too long for instructions, over-relying on authority, and lack of independence.",
  },
  indep: {
    catchphrase: "I'll figure it out myself.",
    likes: "Freedom to make decisions, trusting instincts, and flexibility.",
    dislikes: "Over-controlling, strict rules, and waiting for approval.",
    goodMatch: "The Agile Go-Getter",
    badMatch: "The Guided Follower",
    strengths: "Self-reliant nature, resourcefulness, and confidence in one's own intuition.",
    weaknesses: "Ignoring advice, taking risks on your own, and poor coordination.",
  },
  adapt: {
    catchphrase: "No best survival plan, so I adapt.",
    likes: "Solving problems on the fly, flexibility, and freedom of action.",
    dislikes: "Overthinking, waiting for perfect information or timing.",
    goodMatch: "The Equipped Mover",
    badMatch: "The Guided Follower",
    strengths: "Quick thinking under pressure, and high ability to adapt to unexpected changes.",
    weaknesses: "Acting without fully considering risks, and inconsistency in decisions.",
  },
  mobil: {
    catchphrase: "I am ready to move!",
    likes: "Travelling, flexible plans, transport options, and changing environments.",
    dislikes: "Being stuck in one place, rigid routines, delays, and lack of mobility.",
    goodMatch: "The Independent Pathfinder",
    badMatch: "The Cautious Survivor",
    strengths: "Comfort in changing situations, moving efficiently, adapting quickly, and planning routes well.",
    weaknesses: "Moving too quickly, missing details, and prioritizing movement over stability.",
  },
  safety: {
    catchphrase: "Let's not take the risk!",
    likes: "Safe routes, backup options, and staying in control of situations.",
    dislikes: "Unnecessary risks, impulsive decisions, and uncertainty.",
    goodMatch: "The Guided Follower",
    badMatch: "The Agile Go-Getter",
    strengths: "Strong risk awareness, avoiding danger, and preparing for worst-case scenarios.",
    weaknesses: "Missing opportunities that require quick action, and overly cautious or slow decision-making.",
  },
  commu: {
    catchphrase: "No one faces this alone.",
    likes: "Working with others, supporting people, trusted teams, and finding solutions together.",
    dislikes: "Self-centered behavior, being alone, panic, and feeling overlooked or ignored.",
    goodMatch: "The Cautious Survivor / The Intuitive Adapter",
    badMatch: "The Decisive Catalyst",
    strengths: "Supportive and cooperative nature, compassion, creating trust, and working in teams.",
    weaknesses: "Prioritizing others, slow decision-making, overcommitting, and tendency to take unnecessary risks.",
  },
  prep: {
    catchphrase: "One step ahead.",
    likes: "Careful planning, preparation, and knowing what comes next.",
    dislikes: "Unclear plans, last-minute decisions, and improvising.",
    goodMatch: "The Intuitive Adapter",
    badMatch: "The Independent Pathfinder",
    strengths: "Being organized, reliability, forward-thinking, responsibility, and risk awareness.",
    weaknesses: "Being overly cautious, hesitating under uncertainty, slow improvising, and depending too much on a plan.",
  },
}

export function getPersonalityTraitRows(key: PersonalityDimension): { label: string; value: string }[] {
  if (key === "unpredictable") return []
  const t = PERSONALITY_TRAITS_BY_DIMENSION[key]
  return [
    { label: "Catchphrase", value: `“${t.catchphrase}”` },
    { label: "Likes", value: t.likes },
    { label: "Dislikes", value: t.dislikes },
    { label: "Good match", value: t.goodMatch },
    { label: "Bad match", value: t.badMatch },
    { label: "Strengths", value: t.strengths },
    { label: "Weaknesses", value: t.weaknesses },
  ]
}
