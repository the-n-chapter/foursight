"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Home } from "lucide-react"

export function PublicNav() {
  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 ml-2">
        <Link
          href="/"
          aria-label="Home"
          className="inline-flex h-9 w-9 items-center justify-center rounded-none border-2 border-foreground bg-[#66e6dc] text-foreground shadow-[2px_2px_0_0_#1b3128] hover:bg-[#45d3c8]"
        >
          <Home className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
