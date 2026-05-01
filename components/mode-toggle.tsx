"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Network } from "lucide-react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isSimple = theme === "simple"

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "simple" ? "full" : "simple")
  }
  const hoverLabel = isSimple ? "Switch to the full mode" : "Switch to the simple mode"

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-none border-2 border-foreground bg-white text-foreground shadow-[2px_2px_0_0_#1b3128]"
        disabled
      >
        <Network className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle mode</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-none border-2 border-foreground bg-white text-foreground shadow-[2px_2px_0_0_#1b3128] hover:bg-[#f3f4f6]"
      onClick={toggleTheme}
      title={hoverLabel}
    >
      <Network
        className={`h-[1.2rem] w-[1.2rem] transition-all ${isSimple ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`}
      />
      <span
        aria-hidden
        className={`absolute h-2.5 w-2.5 rounded-full bg-current transition-all ${isSimple ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
      />
      <span className="sr-only">{hoverLabel}</span>
    </Button>
  )
}

