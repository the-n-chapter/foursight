"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function PlayConsentGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem("foursight-consent") === "yes") {
      setAllowed(true)
      return
    }
    router.replace("/")
  }, [router])

  if (!allowed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-16 text-muted-foreground text-sm">
        Loading…
      </div>
    )
  }

  return <>{children}</>
}
