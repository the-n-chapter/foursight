"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useGameStore } from "@/lib/stores/use-game-store"

export default function WelcomePage() {
  const router = useRouter()
  const setConsentAccepted = useGameStore((s) => s.setConsentAccepted)
  const [consentOpen, setConsentOpen] = useState(false)

  const onAgree = () => {
    setConsentAccepted(true)
    setConsentOpen(false)
    router.push("/play/profile")
  }

  const onDecline = () => {
    setConsentOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#1476f2] p-3 md:items-start md:p-6 md:pt-2"
        style={{
          backgroundImage:
            "linear-gradient(rgba(9,52,117,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(9,52,117,0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div className="relative h-[380px] w-full max-w-5xl overflow-hidden sm:h-[420px] md:-mt-10 md:h-[540px] lg:h-[640px]">
          <div className="absolute left-1/2 top-0 h-[700px] w-[1024px] -translate-x-1/2 origin-top scale-[0.42] sm:scale-[0.52] md:scale-[0.7] lg:scale-100">
          <span
            className="absolute left-[28%] top-[10.4%] block h-4 w-28 bg-white/85"
            style={{ clipPath: "polygon(0 38%, 83% 38%, 83% 12%, 100% 50%, 83% 88%, 83% 62%, 0 62%)" }}
          />

          <div className="absolute left-[13%] top-[21%] w-24 border-[3px] border-black bg-white shadow-[3px_3px_0_0_#000]">
            <div className="flex h-4 items-center justify-end border-b-[3px] border-black bg-[#ffe129] px-1 text-[8px] font-black text-black">
              _ 口 ×
            </div>
            <div className="flex h-11 items-center justify-center">
              <span className="h-8 w-8 rotate-45 rounded-sm border-[3px] border-black bg-[#ff3b77]" />
            </div>
          </div>

          <div className="absolute left-[46%] top-[21%] w-44 border-[3px] border-black bg-white shadow-[3px_3px_0_0_#000]">
            <div className="flex h-4 items-center justify-end border-b-[3px] border-black bg-[#ffe129] px-1 text-[8px] font-black text-black">
              _ 口 ×
            </div>
            <div className="flex h-9 items-center justify-center gap-2 text-2xl font-black">
              <span className="text-[#2f69ff]">✓</span>
              <span className="text-[#34d0b8]">✓</span>
              <span className="text-[#b784ea]">✓</span>
              <span className="text-[#b784ea]">✓</span>
            </div>
          </div>

          <span className="absolute left-[75%] top-[18%] h-10 w-10 rotate-45 rounded-sm border-[3px] border-black bg-[#ff3b77]" />
          <span className="absolute left-[80%] top-[29%] h-7 w-7 rounded-full border-[3px] border-[#1637b8] bg-transparent" />

          {/* Map pin icon */}
          <svg
            className="absolute left-[32%] top-[32%]"
            width="36" height="44"
            viewBox="0 0 36 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pin body */}
            <path
              d="M18 2C9.716 2 3 8.716 3 17C3 25.284 18 42 18 42C18 42 33 25.284 33 17C33 8.716 26.284 2 18 2Z"
              fill="#34e2cc"
              stroke="black"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Inner circle */}
            <circle cx="18" cy="17" r="5.5" fill="#9ff4ea" stroke="black" strokeWidth="2.5" />
          </svg>

          <div className="absolute left-[62%] top-[31%] inline-flex min-h-[56px] items-center justify-center rounded-full border-[3px] border-black bg-[#ffe129] px-4 py-2 text-4xl font-black leading-none text-black md:text-[40px]">
            <span className="block text-[0.52em] leading-none">Personality Test</span>
          </div>

          {/* Cursor arrow pointing to FOURSIGHT button */}
          <svg
            className="absolute left-[22%] top-[44%]"
            width="48" height="52"
            viewBox="0 0 48 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: "rotate(-20deg)" }}
          >
            {/* Click lines */}
            <line x1="38" y1="4" x2="44" y2="1" stroke="black" strokeWidth="3" strokeLinecap="round"/>
            <line x1="42" y1="10" x2="48" y2="9" stroke="black" strokeWidth="3" strokeLinecap="round"/>
            <line x1="36" y1="1" x2="35" y2="0" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            {/* Cursor body */}
            <path
              d="M6 4L42 28L26 30L18 46L6 4Z"
              fill="#34e2cc"
              stroke="black"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>

          <button
            type="button"
            onClick={() => setConsentOpen(true)}
            className="absolute left-1/2 top-[43%] w-[58%] -translate-x-1/2 rounded-[2.2rem] border-[4px] border-black bg-white px-4 py-2.5 text-center shadow-[6px_6px_0_0_#000] transition-transform duration-150 hover:-translate-y-0.5"
          >
            <span className="text-4xl font-black uppercase tracking-normal text-[#ff2f75] [text-shadow:-1px_0_0_#000,1px_0_0_#000,0_-1px_0_#000,0_1px_0_#000,2px_2px_0_#000] sm:text-6xl md:text-7xl">
              FOURSIGHT
            </span>
          </button>

          <div className="absolute left-[48%] top-[62%] inline-flex min-h-[58px] items-center justify-center rounded-full border-[4px] border-black bg-white px-8 py-2 text-2xl font-black text-black shadow-[4px_4px_0_0_#000] md:text-5xl">
            <span className="block text-[0.56em] leading-none">Crisis Simulation</span>
          </div>

          <span className="absolute left-[12%] bottom-[35%] h-6 w-6 rotate-45 rounded-sm border-[3px] border-[#0a8f82] bg-[#37e4d0]" />
          <span className="absolute left-[44%] bottom-[28%] h-8 w-8 rotate-45 rounded-sm border-[3px] border-[#9a8600] bg-[#ffd92c]" />

          <div className="absolute left-[20%] bottom-[25%] h-14 w-16 border-[3px] border-black bg-[#c87cf0] shadow-[3px_3px_0_0_#000]">
            <div className="flex h-4 items-center justify-end border-b-[3px] border-black bg-[#dd9cf8] px-1 text-[8px] font-black text-black">
              _ 口 ×
            </div>
            <div className="flex h-9 items-center justify-center text-3xl leading-none text-black">•••</div>
            <span className="absolute -bottom-[9px] left-5 h-4 w-4 rotate-45 border-b-[3px] border-r-[3px] border-black bg-[#c87cf0]" />
          </div>

          <span className="absolute left-[38%] bottom-[21%] text-6xl leading-none text-white/75">◍</span>
          <span className="absolute left-[53%] bottom-[16%] h-10 w-10 rounded-full border-[3px] border-[#8e47b5] bg-[#d27dff]" />

          <div className="absolute left-[68%] bottom-[17%] w-44 border-[3px] border-black bg-white shadow-[3px_3px_0_0_#000]">
            <div className="flex h-4 items-center justify-end border-b-[3px] border-black bg-[#dd9cf8] px-1 text-[8px] font-black text-black">
              _ 口 ×
            </div>
            <div className="flex h-12 items-center justify-center gap-3">
              <span className="h-6 w-6 rotate-45 rounded-sm border-[3px] border-black bg-[#ff4f8b]" />
              <span className="h-6 w-6 rounded-full border-[3px] border-black bg-[#2e6cff]" />
              <span className="h-0 w-0 border-b-[14px] border-l-[10px] border-r-[10px] border-b-[#f5cf22] border-l-transparent border-r-transparent drop-shadow-[1px_1px_0_#000]" />
            </div>
          </div>
          </div>
        </div>
      </div>

      <Dialog open={consentOpen} onOpenChange={setConsentOpen}>
        <DialogContent className="overflow-hidden border-[3px] border-foreground bg-[#eaf6ff] p-0 shadow-[10px_10px_0_0_#1b3128] [&>button]:hidden sm:max-w-md">
          <div className="flex items-center justify-between border-b-[3px] border-foreground bg-[#66e6dc] px-3 py-2">
            <span className="text-xs font-black uppercase tracking-wide text-foreground">Consent Window</span>
            <div className="flex gap-1.5">
              <span className="h-3 w-3 border-2 border-foreground bg-[#f7b038]" />
              <span className="h-3 w-3 border-2 border-foreground bg-[#b784ea]" />
              <DialogClose
                className="flex h-3 w-3 items-center justify-center border-2 border-foreground bg-[#ff6b6b] text-[8px] font-black leading-none text-foreground"
                aria-label="Close consent window"
              >
                x
              </DialogClose>
            </div>
          </div>
          <DialogHeader className="bg-[#eaf6ff] px-4 pb-2 pt-4">
            <DialogTitle className="inline-block w-fit border-2 border-foreground bg-[#fff5a8] px-2 py-1 text-base font-black uppercase tracking-wide">
              Before You Start
            </DialogTitle>
            <DialogDescription className="mt-3 border-2 border-foreground bg-white p-3 text-left text-sm font-medium leading-relaxed text-foreground">
              <span className="block">
                We collect gameplay data to support analysis and improve the game. Participation is voluntary,
                and you can stop at any time.
              </span>
              <span className="mt-3 block border-2 border-foreground bg-[#ffd8f6] px-2 py-1 text-center text-sm font-black uppercase text-foreground">
                Do you agree?
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-[#d9d9ff] px-4 pb-4 pt-2 sm:justify-end sm:space-x-3">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-[#fff5a8] text-foreground hover:bg-[#ffe86b] sm:w-auto"
              onClick={onDecline}
            >
              No
            </Button>
            <Button
              type="button"
              className="w-full bg-[#66e6dc] text-foreground hover:bg-[#45d3c8] sm:w-auto"
              onClick={onAgree}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}