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
    catchphrase: "Let's get moving!",
    likes: "Fast decisions, immediate action, leading the way.",
    dislikes: "Hesitation, red tape, slow responses.",
    goodMatch: "Flexible Adapter, Go-Getter",
    badMatch: "Safety Seeker, Guided Follower",
    strengths: "Decisive, brave, fast-reacting",
    weaknesses: "Impulsive, may miss key details",
  },
  trust: {
    catchphrase: "Just tell me what to do.",
    likes: "Clear instructions, trusted plans, organized systems.",
    dislikes: "Chaos, conflicting advice, having to improvise.",
    goodMatch: "Safety Seeker, Flexible Adapter",
    badMatch: "Quickstarter, Go-Getter",
    strengths: "Dependable, accurate, disciplined",
    weaknesses: "Hesitant without guidance, less flexible",
  },
  indep: {
    catchphrase: "I'll figure it out myself.",
    likes: "Autonomy, freedom to make decisions, relying on instincts.",
    dislikes: "Micromanagement, strict rules, waiting for approval.",
    goodMatch: "Quickstarter, Flexible Adapter",
    badMatch: "Guided Follower, Safety Seeker",
    strengths: "Self-reliant, resourceful, confident",
    weaknesses: "May ignore advice, risk of mistakes, can work alone too much",
  },
  adapt: {
    catchphrase: "We'll make it work.",
    likes: "Adapting, problem-solving, going with the flow.",
    dislikes: "Rigidity, surprises without freedom, strict rules.",
    goodMatch: "Quickstarter, Independent Thinker",
    badMatch: "Safety Seeker, Guided Follower",
    strengths: "Calm under pressure, versatile, solution-focused",
    weaknesses: "Can overcompromise, sometimes indecisive",
  },
  mobil: {
    catchphrase: "Let's go, no time to waste!",
    likes: "Action, taking the lead, moving fast.",
    dislikes: "Waiting around, being slowed down, dependence on others.",
    goodMatch: "Quickstarter, Independent Thinker",
    badMatch: "Safety Seeker, Guided Follower",
    strengths: "Energetic, proactive, inspires others",
    weaknesses: "May ignore safety, burnout risk, can act without planning",
  },
  safety: {
    catchphrase: "Better safe than sorry.",
    likes: "Planning, risk assessment, protocols, preparation.",
    dislikes: "Rushed decisions, recklessness, uncertainty.",
    goodMatch: "Guided Follower, Flexible Adapter",
    badMatch: "Quickstarter, Go-Getter",
    strengths: "Risk-aware, reliable, thorough",
    weaknesses: "Slow to act, overthinking, may miss fast-moving opportunities",
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
