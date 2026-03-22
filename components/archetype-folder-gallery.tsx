"use client"

import { useState } from "react"
import Image from "next/image"
import { PersonalityFlipCard } from "@/components/personality-flip-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { DimensionKey } from "@/lib/dimension-scoring"
import { DIMENSION_KEYS } from "@/lib/dimension-scoring"
import { getPersonalityAccent } from "@/lib/personality-accent"
import { getPersonalityCard } from "@/lib/personality-cards"
import type { PersonalityCard } from "@/lib/personality-cards"

const PREVIEW_IMAGE: Partial<Record<PersonalityCard["dimension"], string>> = {
  react: "/images/quick.png",
  trust: "/images/trust.png",
  indep: "/images/independent.png",
  adapt: "/images/adapt.png",
  mobil: "/images/mobility.png",
  safety: "/images/safety.png",
}

export function ArchetypeFolderGallery() {
  const [openKey, setOpenKey] = useState<DimensionKey | null>(null)
  const [hoveredKey, setHoveredKey] = useState<DimensionKey | null>(null)

  const selected = openKey ? getPersonalityCard(openKey) : null

  return (
    <>
      <div className="relative mx-auto w-full px-1">
        <p className="mb-7 text-center text-sm text-muted-foreground">
          Hover a card to peek and click to open the full archetype card
        </p>

        <div className="overflow-y-visible pb-4 max-lg:overflow-x-visible max-lg:pt-10 lg:overflow-x-auto lg:pt-14 lg:[scrollbar-width:thin] xl:pt-16">
          <div
            className={cn(
              "mx-auto justify-items-center gap-6 px-2 pb-2 max-lg:grid max-lg:max-w-3xl max-lg:grid-cols-1 sm:max-lg:grid-cols-2 sm:max-lg:gap-x-4 sm:max-lg:gap-y-6",
              "lg:flex lg:max-w-none lg:min-w-min lg:flex-nowrap lg:items-end lg:justify-center lg:gap-0"
            )}
          >
            {DIMENSION_KEYS.map((key, i) => {
              const personality = getPersonalityCard(key)
              const accent = getPersonalityAccent(key)
              const img = PREVIEW_IMAGE[key]
              const isHover = hoveredKey === key
              const lift = isHover ? -14 : 0
              const scale = isHover ? 1.06 : 1
              const z = isHover ? 60 : i + 1

              return (
                <button
                  key={key}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={openKey === key}
                  onClick={() => setOpenKey(key)}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onFocus={() => setHoveredKey(key)}
                  onBlur={() => setHoveredKey(null)}
                  style={{
                    zIndex: z,
                    transform: `translateY(${lift}px) scale(${scale})`,
                  }}
                  className={cn(
                    "relative w-full max-w-[20rem] shrink-0 origin-bottom rounded-2xl p-[1px] text-left shadow-md outline-none sm:max-w-[22rem]",
                    "lg:w-[23.5rem] lg:max-w-none xl:w-[24.75rem]",
                    i > 0 && "lg:ml-[calc(-0.7*23.5rem)] xl:ml-[calc(-0.7*24.75rem)]",
                    "bg-gradient-to-br to-transparent",
                    accent.outerGradient,
                    "transition-[transform,box-shadow] duration-300 ease-out",
                    isHover && "shadow-2xl ring-2 ring-ring/35 ring-offset-2 ring-offset-background",
                    accent.focusRing
                  )}
                >
                  <div className="rounded-[0.9rem] bg-background p-0.5 dark:bg-background">
                    <div
                      className={cn(
                        "rounded-[0.85rem] bg-gradient-to-br px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6",
                        accent.headerGradient
                      )}
                    >
                      <h3 className="font-personality text-balance text-center text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
                        {personality.title}
                      </h3>
                      {img ? (
                        <div className="relative mx-auto mt-4 h-32 w-full max-w-[14.75rem] sm:mt-5 sm:h-36">
                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-contain object-center"
                            sizes="(max-width: 640px) 280px, 300px"
                          />
                        </div>
                      ) : null}
                      <p className="mt-4 text-center text-xs text-muted-foreground sm:mt-5">
                        Click for full card
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <Dialog open={openKey != null} onOpenChange={(next) => !next && setOpenKey(null)}>
        <DialogContent
          className={cn(
            "max-h-[92vh] w-[calc(100vw-1rem)] max-w-xl gap-0 overflow-y-auto border-0 bg-transparent p-2 shadow-none",
            "sm:max-w-xl sm:p-3",
            "[&>button]:right-3 [&>button]:top-3 [&>button]:z-[60] [&>button]:rounded-full [&>button]:border [&>button]:border-border/60 [&>button]:bg-background/90 [&>button]:p-1.5"
          )}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {selected ? (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="-mt-8">
                <PersonalityFlipCard key={selected.dimension} personality={selected} />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
