"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { BookOpen, Home, Users } from "lucide-react"

export function GameNav() {
  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full border-b bg-background">
      <div className="flex h-16 w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="Home"
            title="Click to go to the landing page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-none border-2 border-foreground bg-[#66e6dc] text-foreground shadow-[2px_2px_0_0_#1b3128] hover:bg-[#45d3c8]"
          >
            <Home className="h-[1.2rem] w-[1.2rem]" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/about"
            title="Click to see the introduction of this project"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-foreground bg-[#fff5a8] text-foreground shadow-[2px_2px_0_0_#1b3128] hover:bg-[#ffe86b] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1 sm:text-sm sm:font-black"
          >
            <BookOpen className="h-[1.2rem] w-[1.2rem] sm:h-4 sm:w-4" />
            <span className="sr-only sm:not-sr-only">About</span>
          </Link>
          <Link
            href="/archetypes"
            title="Click to see the all personality types"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-foreground bg-[#d9d9ff] text-foreground shadow-[2px_2px_0_0_#1b3128] hover:bg-[#c9c9ff] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1 sm:text-sm sm:font-black"
          >
            <Users className="h-[1.2rem] w-[1.2rem] sm:h-4 sm:w-4" />
            <span className="sr-only sm:not-sr-only">Archetypes</span>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
