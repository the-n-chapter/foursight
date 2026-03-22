"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, BookOpen, Users } from "lucide-react"

export function GameNav() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (path: string) => {
    setMenuOpen(false)
    router.push(path)
  }

  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 ml-2">
        <div className="flex items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="mt-8 flex flex-col gap-2 px-2">
                <button
                  type="button"
                  onClick={() => go("/about")}
                  className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <BookOpen className="h-5 w-5" />
                  About
                </button>
                <button
                  type="button"
                  onClick={() => go("/archetypes")}
                  className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Users className="h-5 w-5" />
                  Archetypes
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
          >
            FOURSIGHT
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
