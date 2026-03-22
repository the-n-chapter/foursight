"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Copy, Facebook, Link2, Mail, MessageCircle, Share2, Twitter } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PLAY_PATH = "/play"

interface ResultShareProps {
  personalityTitle: string
  nickname?: string | null
  /** Label on the trigger button */
  triggerLabel?: string
  /** Classes for the trigger (e.g. w-full flex-1 for a row layout) */
  triggerClassName?: string
}

export function ResultShare({
  personalityTitle,
  nickname,
  triggerLabel = "Share",
  triggerClassName,
}: ResultShareProps) {
  const [origin, setOrigin] = useState("")
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin)
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function")
  }, [])

  const playUrl = origin ? `${origin}${PLAY_PATH}` : ""

  const shareLine = useMemo(() => {
    const core = `What's your crisis style? Play FOURSIGHT: ${playUrl || PLAY_PATH}`
    if (nickname?.trim()) {
      return `${nickname.trim()} got “${personalityTitle}” on FOURSIGHT. ${core}`
    }
    return `I got “${personalityTitle}” on FOURSIGHT. ${core}`
  }, [nickname, personalityTitle, playUrl])

  const copyText = useCallback(
    async (text: string, success: string) => {
      try {
        await navigator.clipboard.writeText(text)
        toast.success(success)
      } catch {
        toast.error("Could not copy to clipboard")
      }
    },
    []
  )

  const openNativeShare = useCallback(async () => {
    if (!playUrl) return
    try {
      await navigator.share({
        title: "FOURSIGHT",
        text: shareLine,
        url: playUrl,
      })
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return
      toast.error("Could not open share sheet")
    }
  }, [playUrl, shareLine])

  const disabled = !playUrl

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareLine)}`
  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareLine)}`
  const emailHref = `mailto:?subject=${encodeURIComponent(`FOURSIGHT — ${personalityTitle}`)}&body=${encodeURIComponent(shareLine)}`
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(playUrl)}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="default"
          className={cn("rounded-full gap-2", triggerClassName)}
          disabled={disabled}
        >
          <Share2 className="h-4 w-4 shrink-0" aria-hidden />
          {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-[14rem]">
        <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
          Share with friends
        </DropdownMenuLabel>
        {canNativeShare && (
          <>
            <DropdownMenuItem onSelect={() => void openNativeShare()}>
              <Share2 className="h-4 w-4" aria-hidden />
              Share via device…
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          disabled={disabled}
          onSelect={(e) => {
            e.preventDefault()
            void copyText(playUrl, "Quiz link copied")
          }}
        >
          <Link2 className="h-4 w-4" aria-hidden />
          Copy quiz link
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={disabled}
          onSelect={(e) => {
            e.preventDefault()
            void copyText(shareLine, "Message copied")
          }}
        >
          <Copy className="h-4 w-4" aria-hidden />
          Copy message
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={disabled} asChild>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={disabled} asChild>
          <a href={tweetHref} target="_blank" rel="noopener noreferrer">
            <Twitter className="h-4 w-4" aria-hidden />
            Post on X
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={disabled} asChild>
          <a href={emailHref}>
            <Mail className="h-4 w-4" aria-hidden />
            Email
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={disabled} asChild>
          <a href={facebookHref} target="_blank" rel="noopener noreferrer">
            <Facebook className="h-4 w-4" aria-hidden />
            Facebook
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
