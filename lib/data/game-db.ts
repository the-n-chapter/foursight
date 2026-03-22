import type { DimensionKey } from "@/lib/dimension-scoring"

export type GenderOption = "female" | "male" | "other"

export type DependencyId = "children" | "elderly" | "pets"

/** Wiki-style blurbs for the six scoring dimensions (replace with real copy later). */
export interface DimensionWikiEntry {
  key: DimensionKey
  title: string
  shortLabel: string
  description: string
  wikiBody: string
}

export const DIMENSION_WIKI: DimensionWikiEntry[] = [
  {
    key: "react",
    title: "Reactivity",
    shortLabel: "react",
    description: "Lorem ipsum — how quickly you move from signal to action under uncertainty.",
    wikiBody:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    key: "trust",
    title: "Institutional trust",
    shortLabel: "trust",
    description: "Lorem ipsum — reliance on official channels, coordination, and shared guidance.",
    wikiBody:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    key: "indep",
    title: "Independence",
    shortLabel: "indep",
    description: "Lorem ipsum — self-directed judgment versus following the crowd or close ties.",
    wikiBody:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    key: "adapt",
    title: "Adaptability",
    shortLabel: "adapt",
    description: "Lorem ipsum — flexibility when plans and routes stop working.",
    wikiBody:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
  },
  {
    key: "mobil",
    title: "Mobility",
    shortLabel: "mobil",
    description: "Lorem ipsum — willingness to move, reroute, and keep progressing.",
    wikiBody:
      "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
  },
  {
    key: "safety",
    title: "Safety orientation",
    shortLabel: "safety",
    description: "Lorem ipsum — protecting self and dependants versus speed or autonomy.",
    wikiBody:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  },
]

export function getDimensionWiki(key: DimensionKey): DimensionWikiEntry | undefined {
  return DIMENSION_WIKI.find((d) => d.key === key)
}
