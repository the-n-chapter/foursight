import type { ReactNode } from "react"
import { GameNav } from "@/components/game-nav"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <GameNav />
      <main className="flex flex-1 flex-col pt-16">{children}</main>
    </div>
  )
}
