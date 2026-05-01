"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { BookOpen, Home, Users } from "lucide-react"

export function GameNav() {
  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 ml-2">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex h-9 w-9 items-center justify-center rounded-none border-2 border-foreground bg-[#66e6dc] text-foreground shadow-[2px_2px_0_0_#1b3128] hover:bg-[#45d3c8]"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-none border-2 border-foreground bg-[#fff5a8] px-3 py-1 text-sm font-black text-foreground shadow-[2px_2px_0_0_#1b3128] hover:bg-[#ffe86b]"
          >
            <BookOpen className="h-4 w-4" />
            About
          </Link>
          <Link
            href="/archetypes"
            className="inline-flex items-center gap-1.5 rounded-none border-2 border-foreground bg-[#d9d9ff] px-3 py-1 text-sm font-black text-foreground shadow-[2px_2px_0_0_#1b3128] hover:bg-[#c9c9ff]"
          >
            <Users className="h-4 w-4" />
            Archetypes
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
