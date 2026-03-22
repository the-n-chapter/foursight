"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export function PublicNav() {
  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 ml-2">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          FOURSIGHT
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
