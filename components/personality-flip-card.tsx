"use client"

import Image from "next/image"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PersonalityCard } from "@/lib/personality-cards"
import { getPersonalityAccent } from "@/lib/personality-accent"
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

const staticFaceShell =
  "flex min-h-[22rem] w-full flex-col overflow-hidden rounded-none border-4 border-black bg-card"

export function PersonalityFlipCard({ personality }: PersonalityFlipCardProps) {
  const traitRows = getPersonalityTraitRows(personality.dimension)
  const accent = getPersonalityAccent(personality.dimension)
  const frontIllustrationSrc = FRONT_ILLUSTRATION[personality.dimension]

  return (
    <div className="mt-8">
      <div
        className={cn(
          "relative mx-auto w-full max-w-xl rounded-none border-2 border-black p-[1px]",
          "bg-gradient-to-br to-transparent",
          accent.outerGradient
        )}
      >
        <div className="rounded-none bg-background p-0.5">
          <div className={cn(staticFaceShell, accent.faceBorder)}>
            <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90", accent.topLineGradient)} />
            <CardHeader
              className={cn(
                "relative shrink-0 items-center border-b-2 border-black bg-gradient-to-br px-6 py-6 text-center",
                accent.headerGradient
              )}
            >
              <CardTitle className="font-personality text-balance text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl sm:leading-[1.15]">
                {personality.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-5 px-6 pb-6 pt-3">
              {frontIllustrationSrc && (
                <div className="relative mt-1 h-36 w-full shrink-0 sm:h-40">
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
                <section>
                  <div className="mb-2 flex items-center gap-2">
                    <span className={cn("h-3 w-1 bg-black", accent.sectionBar)} aria-hidden />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-foreground">Traits</h3>
                  </div>
                  <dl className="grid w-full grid-cols-[6.75rem_minmax(0,1fr)] gap-x-3 gap-y-2 border-2 border-black bg-white px-2 py-2 text-xs sm:grid-cols-[7.25rem_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-2.5">
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

              <section>
                <div className="mb-2 flex items-center gap-2">
                  <span className={cn("h-3 w-1 bg-black", accent.sectionBar)} aria-hidden />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-foreground">Description</h3>
                </div>
                <p className="rounded-none border-2 border-black bg-white px-3 py-2.5 text-sm leading-relaxed text-black">
                  {personality.description}
                </p>
              </section>

              {personality.crisisTips.length > 0 ? (
                <section>
                  <div className="mb-2 flex items-center gap-2">
                    <span className={cn("h-3 w-1 bg-black", accent.sectionBar)} aria-hidden />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-foreground">Crisis tips</h3>
                  </div>
                  <ul className="list-none space-y-1.5">
                    {personality.crisisTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 rounded-none border-2 border-black bg-[#fff5a8] px-2 py-1.5 text-xs leading-snug text-black">
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
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}
