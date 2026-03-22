"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PublicNav } from "@/components/public-nav"
import { Button } from "@/components/ui/button"
import {
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
      <PublicNav />
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-8">
        <div className="w-full max-w-3xl px-4 pt-16 text-center md:pt-24 md:text-left">
          <h1 className="font-personality text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Meet your{" "}
            <span className="text-primary">crisis</span>
            {" "}self.
          </h1>

          <div className="relative mt-8 aspect-[4/1] w-full overflow-hidden rounded-lg md:mt-10">
            <Image
              src="/images/landing.jpg"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 48rem"
              priority
            />
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
            Uncover your survival personality in large-scale emergency situations.
          </p>

          <div className="mt-12 flex justify-center md:justify-start">
            <Button
              type="button"
              variant="outline"
              className="h-14 min-h-14 rounded-full border border-primary bg-transparent px-9 text-xl font-semibold text-primary shadow-none transition-colors duration-200 ease-out hover:bg-primary hover:text-white md:h-16 md:min-h-16 md:px-12 md:text-2xl"
              onClick={() => setConsentOpen(true)}
            >
              Start Now
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={consentOpen} onOpenChange={setConsentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Before you start</DialogTitle>
            <DialogDescription className="space-y-4 pt-2 text-left">
              <span className="block">
                We collect gameplay data to support analysis and improve the game. Participation is voluntary,
                and you can stop at any time.
              </span>
              <span className="block font-medium text-foreground">Do you agree?</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onDecline}>
              No
            </Button>
            <Button type="button" className="w-full sm:w-auto" onClick={onAgree}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
