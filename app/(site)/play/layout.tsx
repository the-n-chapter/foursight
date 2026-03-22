import type { ReactNode } from "react"
import { PlayConsentGate } from "@/components/play-consent-gate"

export default function PlayLayout({ children }: { children: ReactNode }) {
  return <PlayConsentGate>{children}</PlayConsentGate>
}
