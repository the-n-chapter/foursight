"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { GenderOption, DependencyId } from "@/lib/data/game-db"

export interface PlayerProfile {
  nickname: string
  age: string
  gender: GenderOption | null
  /** Stored in players.municipality */
  municipality: string
  dependencies: DependencyId[]
  hasEvacuationExperience: boolean | null
}

interface GameState {
  consentAccepted: boolean
  /** Matches players.session_token */
  clientSessionId: string | null
  /** Set after POST /api/game/player */
  playerId: string | null
  profile: PlayerProfile | null
  /** question UUID -> chosen option UUID */
  answers: Record<string, string>
  /** `true`: new session token + clears profile, playerId, answers (landing “Yes”). */
  setConsentAccepted: (v: boolean) => void
  ensureClientSessionId: () => string
  setPlayerId: (id: string | null) => void
  setProfile: (p: PlayerProfile) => void
  setAnswer: (questionId: string, optionId: string) => void
  resetSession: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      consentAccepted: false,
      clientSessionId: null,
      playerId: null,
      profile: null,
      answers: {},

      ensureClientSessionId: () => {
        const existing = get().clientSessionId
        if (existing) return existing
        const id =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
        set({ clientSessionId: id })
        return id
      },

      setConsentAccepted: (v) => {
        if (typeof window !== "undefined") {
          if (v) sessionStorage.setItem("foursight-consent", "yes")
          else sessionStorage.removeItem("foursight-consent")
        }
        if (v) {
          const id =
            typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
          set({
            consentAccepted: true,
            clientSessionId: id,
            playerId: null,
            profile: null,
            answers: {},
          })
        } else {
          set({ consentAccepted: false })
        }
      },

      setPlayerId: (id) => set({ playerId: id }),

      setProfile: (p) => set({ profile: p }),

      setAnswer: (questionId, optionId) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: optionId },
        })),

      resetSession: () => {
        if (typeof window !== "undefined") sessionStorage.removeItem("foursight-consent")
        set({
          consentAccepted: false,
          clientSessionId: null,
          playerId: null,
          profile: null,
          answers: {},
        })
      },
    }),
    {
      name: "foursight-game",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        consentAccepted: s.consentAccepted,
        clientSessionId: s.clientSessionId,
        playerId: s.playerId,
        profile: s.profile,
        answers: s.answers,
      }),
    }
  )
)
