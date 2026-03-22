"use client"

import { useState } from "react"
import Image from "next/image"
import { RefreshCw } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PersonalityCard } from "@/lib/personality-cards"
import { getPersonalityAccent, type PersonalityAccent } from "@/lib/personality-accent"
import { getPersonalityTraitRows } from "@/lib/personality-traits"

interface PersonalityFlipCardProps {
  personality: PersonalityCard
}

const FRONT_ILLUSTRATION: Partial<Record<PersonalityCard["dimension"], string>> = {
  react: "/images/quick.png",
  trust: "/images/trust.png",
  indep: "/images/independent.png",
  adapt: "/images/adapt.png",
  mobil: "/images/mobility.png",
  safety: "/images/safety.png",
  unpredictable: "/images/unpredictable.png",
}

const faceShellBase =
  "col-start-1 row-start-1 flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-[0_22px_48px_-16px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.04] dark:bg-card dark:shadow-[0_22px_48px_-16px_rgba(0,0,0,0.55)] dark:ring-white/[0.06] [backface-visibility:hidden]"

const staticFaceShell =
  "flex min-h-[22rem] w-full flex-col overflow-hidden rounded-2xl border bg-card shadow-[0_22px_48px_-16px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.04] dark:bg-card dark:shadow-[0_22px_48px_-16px_rgba(0,0,0,0.55)] dark:ring-white/[0.06]"

function FlipHint({ accent }: { accent: PersonalityAccent }) {
  return (
    <div
      className={cn(
        "mt-auto -mx-6 flex w-auto min-w-0 shrink-0 items-center justify-center gap-2 border-t border-dashed px-6 py-3.5 text-xs text-muted-foreground",
        accent.flipBorder,
        accent.flipBg
      )}
    >
      <RefreshCw className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
      <span className="font-medium tracking-wide">Flip to see more</span>
    </div>
  )
}

export function PersonalityFlipCard({ personality }: PersonalityFlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const isUnpredictable = personality.dimension === "unpredictable"
  const traitRows = getPersonalityTraitRows(personality.dimension)
  const accent = getPersonalityAccent(personality.dimension)
  const frontIllustrationSrc = FRONT_ILLUSTRATION[personality.dimension]

  const toggle = () => setFlipped((f) => !f)

  if (isUnpredictable) {
    const imgSrc = FRONT_ILLUSTRATION.unpredictable ?? "/images/unpredictable.png"
    return (
      <div className="mt-8">
        <div
          className={cn(
            "relative mx-auto w-full max-w-xl rounded-2xl p-[1px]",
            "bg-gradient-to-br to-transparent",
            accent.outerGradient
          )}
        >
          <div className="rounded-2xl bg-background p-0.5">
            <div className={cn(staticFaceShell, accent.faceBorder)}>
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90",
                  accent.topLineGradient
                )}
              />
              <CardHeader
                className={cn(
                  "relative shrink-0 items-center border-0 bg-gradient-to-br px-6 pb-4 pt-8 text-center",
                  accent.headerGradient
                )}
              >
                <CardTitle className="font-personality text-balance text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl sm:leading-[1.15]">
                  {personality.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-5 px-6 pb-8 pt-2">
                <div className="relative mx-auto mt-1 h-36 w-full max-w-sm shrink-0 sm:h-40">
                  <Image
                    src={imgSrc}
                    alt=""
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 640px) 100vw, 28rem"
                    priority
                  />
                </div>
                <section className="text-left">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={cn("h-3 w-0.5 rounded-full", accent.sectionBar)} aria-hidden />
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">
                      Description
                    </h3>
                  </div>
                  <p className="rounded-md border border-border/45 bg-muted/20 px-3 py-2.5 text-sm leading-relaxed text-foreground/90 dark:bg-muted/12">
                    {personality.description}
                  </p>
                </section>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 [perspective:1400px]">
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggle()
          }
        }}
        className={cn(
          "group relative mx-auto w-full max-w-xl cursor-pointer rounded-2xl p-[1px] outline-none",
          "bg-gradient-to-br to-transparent",
          accent.outerGradient,
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          accent.focusRing
        )}
        aria-label={flipped ? "Flip card to profile side" : "Flip card to narrative side"}
      >
        <div className="rounded-2xl bg-background p-0.5">
          <div
            className={cn(
              "relative grid min-h-[27rem] w-full grid-cols-1 grid-rows-1 transition-transform duration-700 ease-flip-smooth [transform-style:preserve-3d]",
              flipped && "[transform:rotateY(180deg)]"
            )}
          >
            {/* Front */}
            <div className={cn(faceShellBase, accent.faceBorder, "[transform:rotateY(0deg)]")}>
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90",
                  accent.topLineGradient
                )}
              />
              <CardHeader
                className={cn(
                  "relative shrink-0 items-center border-0 bg-gradient-to-br px-6 pb-4 pt-8 text-center",
                  accent.headerGradient
                )}
              >
                <CardTitle className="font-personality text-balance text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl sm:leading-[1.15]">
                  {personality.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-5 px-6 pb-0 pt-1">
                {frontIllustrationSrc && (
                  <div className="relative mt-5 h-36 w-full shrink-0 sm:mt-6 sm:h-40">
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
                  <dl className="mb-4 grid w-full grid-cols-[6.75rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs sm:mb-5 sm:grid-cols-[7.25rem_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-2.5">
                    {traitRows.map((row) => (
                      <div key={row.label} className="contents">
                        <dt className="self-start text-[10px] font-semibold uppercase leading-snug tracking-wide text-muted-foreground">
                          {row.label}
                        </dt>
                        <dd className="min-w-0 leading-snug text-foreground/90">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <FlipHint accent={accent} />
              </CardContent>
            </div>

            {/* Back */}
            <div className={cn(faceShellBase, accent.faceBorder, "[transform:rotateY(180deg)]")}>
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90",
                  accent.topLineGradient
                )}
              />
              <CardHeader
                className={cn(
                  "relative shrink-0 items-center border-0 bg-gradient-to-br px-6 pb-4 pt-8 text-center",
                  accent.headerGradient
                )}
              >
                <CardTitle className="font-personality text-balance text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl sm:leading-[1.15]">
                  {personality.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-5 px-6 pb-0 pt-1">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
                    <section className="pt-5">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={cn("h-3 w-0.5 rounded-full", accent.sectionBar)} aria-hidden />
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">
                          Description
                        </h3>
                      </div>
                      <p className="rounded-md border border-border/45 bg-muted/20 px-2 py-1.5 text-xs leading-snug text-foreground/90 dark:bg-muted/12">
                        {personality.description}
                      </p>
                    </section>
                    {personality.crisisTips.length > 0 ? (
                      <section>
                        <div className="mb-2 flex items-center gap-2">
                          <span className={cn("h-3 w-0.5 rounded-full", accent.sectionBar)} aria-hidden />
                          <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">
                            Crisis tips
                          </h3>
                        </div>
                        <ul className="list-none space-y-1.5">
                          {personality.crisisTips.map((tip) => (
                            <li
                              key={tip}
                              className="flex items-center gap-2 rounded-md border border-border/40 bg-muted/15 px-1.5 py-1 text-xs leading-snug text-foreground/90 dark:bg-muted/10"
                            >
                              <span
                                className={cn(
                                  "h-1 w-1 shrink-0 rounded-full ring-1",
                                  accent.crisisBullet,
                                  accent.crisisBulletRing
                                )}
                                aria-hidden
                              />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null}
                  </div>
                </div>
                <FlipHint accent={accent} />
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
