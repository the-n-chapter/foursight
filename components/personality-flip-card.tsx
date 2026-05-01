"use client"

import Image from "next/image"
import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PersonalityCard } from "@/lib/personality-cards"
import { getPersonalityAccent } from "@/lib/personality-accent"
import { getPersonalityTraitRows } from "@/lib/personality-traits"

interface PersonalityFlipCardProps {
  personality: PersonalityCard
  playerName?: string
}

const FRONT_ILLUSTRATION: Partial<Record<PersonalityCard["dimension"], string>> = {
  react: "/images/quick.png",
  trust: "/images/trust.png",
  indep: "/images/independent.png",
  adapt: "/images/adapt.png",
  mobil: "/images/mobility.png",
  safety: "/images/safety.png",
  commu: "/images/helping.png",
  prep: "/images/prep.png",
  unpredictable: "/images/unpredictable.png",
}

const staticFaceShell =
  "flex min-h-[22rem] w-full flex-col overflow-hidden rounded-none border-4 border-black bg-card shadow-[8px_8px_0_0_#000]"

export function PersonalityFlipCard({ personality, playerName }: PersonalityFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const traitRows = getPersonalityTraitRows(personality.dimension)
  const accent = getPersonalityAccent(personality.dimension)
  const frontIllustrationSrc = FRONT_ILLUSTRATION[personality.dimension]
  const headerName = (playerName?.trim() || "Player").toUpperCase()

  return (
    <div className="mt-8">
      <div
        className={cn(
          "relative mx-auto w-full max-w-xl"
        )}
      >
        <div className="bg-background p-0">
          <div className={cn(staticFaceShell, accent.faceBorder, accent.outerGradient)}>
            <div
              className={cn(
                "shrink-0 border-b-[3px] px-3 py-2",
                personality.dimension === "prep" ? "border-white" : "border-black",
                accent.headerGradient
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-black uppercase tracking-wide", personality.dimension === "prep" ? "text-white" : "text-black")}>
                  {`${headerName}'S PERSONALITY CARD`}
                </span>
                <div className="flex gap-1.5" aria-hidden>
                  <span className="h-3 w-3 border-2 border-black bg-[#f7b038]" />
                  <span className="h-3 w-3 border-2 border-black bg-[#b784ea]" />
                  <span className="flex h-3 w-3 items-center justify-center border-2 border-black bg-[#ff6b6b] text-[8px] font-black leading-none text-black">
                    x
                  </span>
                </div>
              </div>
            </div>

            <CardHeader className="px-4 pb-2 pt-4 text-center">
              <CardTitle className="mx-auto inline-block w-fit border-2 border-black bg-[#fff5a8] px-3 py-1.5 font-personality text-2xl font-extrabold uppercase tracking-wide text-black sm:text-3xl">
                {personality.title}
              </CardTitle>
            </CardHeader>

            <CardContent className={cn("min-h-0 flex-1 px-4 pb-4 pt-1", accent.flipBg)}>
              <div className="[perspective:1200px]">
                <div
                  className={cn(
                    "relative grid w-full transition-transform duration-500 [transform-style:preserve-3d]",
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  )}
                >
                  <div className="col-start-1 row-start-1 flex flex-col gap-4 pb-4 sm:pb-3 [backface-visibility:hidden]">
                    {frontIllustrationSrc && (
                      <div className="full-mode-only relative h-36 w-full shrink-0 border-2 border-black bg-white sm:h-40">
                        <Image
                          src={frontIllustrationSrc}
                          alt=""
                          fill
                          className="object-contain object-center"
                          sizes="(max-width: 640px) 100vw, 36rem"
                          priority
                        />
                      </div>
                    )}

                    {traitRows.length > 0 ? (
                      <section className="border-2 border-black bg-white p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <span className={cn("h-3 w-1 bg-black", accent.sectionBar)} aria-hidden />
                          <h3 className="inline-block border border-black bg-[#fff5a8] px-1.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                            Traits
                          </h3>
                        </div>
                        <dl className="grid w-full grid-cols-[6.75rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs sm:grid-cols-[7.25rem_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-2.5">
                          {traitRows.map((row) => (
                            <div key={row.label} className="contents">
                              <dt className="self-start text-[10px] font-black uppercase leading-snug tracking-wide text-black/70">
                                {row.label}
                              </dt>
                              <dd className="min-w-0 leading-snug text-black">{row.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    ) : null}

                    <div className="mt-auto flex justify-center">
                      <button
                        type="button"
                        className="border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black shadow-[2px_2px_0_0_#000] hover:bg-[#fff5a8]"
                        onClick={() => setIsFlipped((prev) => !prev)}
                      >
                        Flip card
                      </button>
                    </div>
                  </div>

                  <div className="col-start-1 row-start-1 flex flex-col gap-4 pb-4 sm:pb-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <section className="border-2 border-black bg-white p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={cn("h-3 w-1 bg-black", accent.sectionBar)} aria-hidden />
                        <h3 className="inline-block border border-black bg-[#fff5a8] px-1.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                          Description
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-black">
                        {personality.description}
                      </p>
                    </section>

                    {personality.crisisTips.length > 0 ? (
                      <section className="border-2 border-black bg-white p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <span className={cn("h-3 w-1 bg-black", accent.sectionBar)} aria-hidden />
                          <h3 className="inline-block border border-black bg-[#fff5a8] px-1.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                            Crisis tips
                          </h3>
                        </div>
                        <ul className="list-none space-y-1.5">
                          {personality.crisisTips.map((tip) => (
                            <li key={tip} className="flex items-start gap-2 px-2 py-1.5 text-xs leading-snug text-black">
                              <span
                                className={cn("mt-[0.4em] h-1.5 w-1.5 shrink-0 rounded-none border border-black", accent.crisisBullet, accent.crisisBulletRing)}
                                aria-hidden
                              />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null}

                    <div className="mt-auto flex justify-center">
                      <button
                        type="button"
                        className="border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black shadow-[2px_2px_0_0_#000] hover:bg-[#fff5a8]"
                        onClick={() => setIsFlipped((prev) => !prev)}
                      >
                        Show front
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}
