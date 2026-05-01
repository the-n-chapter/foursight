"use client"

import { useState } from "react"
import { PersonalityFlipCard } from "@/components/personality-flip-card"
import type { DimensionKey } from "@/lib/dimension-scoring"
import { DIMENSION_KEYS } from "@/lib/dimension-scoring"
import { getPersonalityCard } from "@/lib/personality-cards"

const FOLDER_COLOR: Record<DimensionKey, string> = {
  react: "#FF4D6D",
  trust: "#7B61FF",
  indep: "#FF7A00",
  adapt: "#00C853",
  mobil: "#FFD400",
  safety: "#00B8D9",
  commu: "#E040FB",
  prep: "#4E342E",
}

export function ArchetypeFolderGallery() {
  const [openKey, setOpenKey] = useState<DimensionKey | null>(null)
  const selected = openKey ? getPersonalityCard(openKey) : null

  const toArchetypeTag = (title: string) =>
    `#${title.replace(/^The\s+/i, "").replace(/[^a-zA-Z0-9]+/g, "")}`

  return (
    <>
      <div className="relative mx-auto w-full max-w-7xl bg-[#CFF7FE] p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-1 sm:gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {DIMENSION_KEYS.map((key) => {
            const personality = getPersonalityCard(key)
            return (
              <button
                key={key}
                type="button"
                className="group mx-auto w-full max-w-[8.5rem] rounded-2xl border-2 border-black bg-white p-2 text-center transition-transform duration-150 hover:-translate-y-1"
                onClick={() => setOpenKey(key)}
                aria-pressed={openKey === key}
              >
                <div
                  className="h-28 w-full rounded-xl border-2 border-black"
                  style={{ backgroundColor: FOLDER_COLOR[key] }}
                />
                <span className="mt-3 block min-h-[2.25rem] px-1 text-[10px] leading-tight tracking-wide text-black whitespace-normal break-all sm:text-xs">
                  {toArchetypeTag(personality.title)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {selected ? (
        <div className="mx-auto mt-4 w-full max-w-7xl px-2 sm:px-3">
          <div className="mb-4 border-t-2 border-dashed border-black/60" />
          <div className="mx-auto w-full max-w-xl">
            <PersonalityFlipCard key={selected.dimension} personality={selected} />
          </div>
        </div>
      ) : null}
    </>
  )
}
