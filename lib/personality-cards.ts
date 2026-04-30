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
    title: "The Decisive Catalyst",
    youAreName: "The Decisive Catalyst",
    description:
      "You react quickly when something happens. While others are still processing the situation, you are already moving and making decisions. Your speed can be valuable in emergencies where hesitation costs time.",
    crisisTips: [
      "Use your speed to start action early, but pause briefly to check facts.",
      "Help slower people get moving instead of becoming frustrated with them.",
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
    title: "The Independent Pathfinder",
    youAreName: "The Independent Pathfinder",
    description:
      "In uncertain situations, you rely on your own judgment over others' opinions or instructions. You act quickly and take initiative early, often moving ahead while others are still deciding what to do.",
    crisisTips: [
      "Trust your instincts and experience, but take a moment to check key information, especially from authorities.",
      "Your independence is powerful, and pairing it with teamwork improves both personal and community safety.",
    ],
  },
  adapt: {
    dimension: "adapt",
    dimensionLabel: "ADAPT",
    title: "The Intuitive Adapter",
    youAreName: "The Intuitive Adapter",
    description:
      "You are good at handling uncertainty. When situations change, you do not freeze but adapt. You respond quickly to what is happening in the moment, instead of relying on fixed plans.",
    crisisTips: [
      "Balance improvisation with basic planning to avoid unnecessary risks.",
      "Stick with a good plan when it is working, and avoid changing too quickly.",
    ],
  },
  mobil: {
    dimension: "mobil",
    dimensionLabel: "MOBILITY",
    title: "The Agile Go-Getter",
    youAreName: "The Agile Go-Getter",
    description:
      "When an alert comes, you are ready to move quickly. You prefer using organized transport systems and following planned routes instead of figuring things out on your own.",
    crisisTips: [
      "Use your strength in movement to follow official evacuation routes and transport systems.",
      "Do not prioritize speed over safety; check key details before moving and coordinate with others.",
    ],
  },
  safety: {
    dimension: "safety",
    dimensionLabel: "SAFETY",
    title: "The Cautious Survivor",
    youAreName: "The Cautious Survivor",
    description:
      "You prioritize safety above all else. In uncertain situations, you prefer to slow down, assess risks, and choose the safest path forward. While others may act quickly, you make sure your decisions do not lead to unnecessary danger.",
    crisisTips: [
      "Try to balance caution with timely action, because waiting too long can create new risks.",
      "In fast-changing situations, trust your judgment even without perfect information.",
    ],
  },
  commu: {
    dimension: "commu",
    dimensionLabel: "COMMUNITY",
    title: "The Helping Heart",
    youAreName: "The Helping Heart",
    description:
      "You naturally help others when times get hard. Teamwork, support, and connection are at your core. In a crisis, your presence lifts spirits and brings people together.",
    crisisTips: [
      "Reach out to help others, but always look after your own safety first.",
      "Use your teamwork skills to keep the group calm and make decisions early before confusion spreads.",
    ],
  },
  prep: {
    dimension: "prep",
    dimensionLabel: "PREPAREDNESS",
    title: "The Equipped Mover",
    youAreName: "The Equipped Mover",
    description:
      "You see preparation as the key to confidence. By planning ahead and keeping things organized, you turn uncertainty into clarity long before challenges arise.",
    crisisTips: [
      "Rely on your preparation while keeping your mind open to new possibilities.",
      "Support those who need guidance, and adapt your plans as circumstances change.",
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
