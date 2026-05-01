"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserRound } from "lucide-react"
import { useTheme } from "next-themes"
import { FinnishMunicipalityInput } from "@/components/finnish-municipality-input"
import { Checkbox } from "@/components/ui/checkbox"
import type { GenderOption, DependencyId } from "@/lib/data/game-db"
import { resolveFinnishMunicipality } from "@/lib/finnish-municipality"
import { parseValidAge } from "@/lib/parse-age"
import { useGameStore } from "@/lib/stores/use-game-store"

const GENDERS: { value: GenderOption; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Others" },
]

const DEPS: { id: DependencyId; label: string; emoji: string }[] = [
  { id: "children", label: "Children", emoji: "👶" },
  { id: "elderly", label: "Elderly", emoji: "🧓" },
  { id: "pets", label: "Pets", emoji: "🐾" },
]

export default function PlayProfilePage() {
  const { theme } = useTheme()
  const isSimple = theme === "simple"
  const router = useRouter()
  const setProfile = useGameStore((s) => s.setProfile)
  const setPlayerId = useGameStore((s) => s.setPlayerId)
  const ensureClientSessionId = useGameStore((s) => s.ensureClientSessionId)
  const clientSessionId = useGameStore((s) => s.clientSessionId)
  const existing = useGameStore((s) => s.profile)

  useEffect(() => {
    ensureClientSessionId()
  }, [ensureClientSessionId])

  const [nickname, setNickname] = useState(existing?.nickname ?? "")
  const [age, setAge] = useState(existing?.age ?? "")
  const [municipality, setMunicipality] = useState(existing?.municipality ?? "")
  const [gender, setGender] = useState<GenderOption | null>(existing?.gender ?? null)
  const [dependencies, setDependencies] = useState<DependencyId[]>(existing?.dependencies ?? [])
  const [hasEvacuationExperience, setHasEvacuationExperience] = useState<boolean | null>(
    existing?.hasEvacuationExperience ?? null
  )
  const [saving, setSaving] = useState(false)

  const toggleDep = (id: DependencyId) => {
    setDependencies((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const resolvedMunicipality = resolveFinnishMunicipality(municipality)
  const validAge = parseValidAge(age)
  const canContinue = Boolean(
    gender && validAge !== null && resolvedMunicipality && hasEvacuationExperience !== null
  )

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gender) { toast.error("Please select a gender."); return }
    if (validAge === null) { toast.error("Age must be a whole number between 1 and 120."); return }
    const muni = resolveFinnishMunicipality(municipality)
    if (!muni) { toast.error("Choose your municipality from the list."); return }
    if (hasEvacuationExperience === null) { toast.error("Please select YES or NO for evacuation experience."); return }

    const nicknameForSave = nickname.trim() || "Anonymous"
    const token = clientSessionId ?? ensureClientSessionId()
    setSaving(true)
    try {
      const res = await fetch("/api/game/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: token,
          nickname: nickname.trim(),
          age: String(validAge),
          gender,
          municipality: muni,
          has_children: dependencies.includes("children"),
          has_elderly: dependencies.includes("elderly"),
          has_pets: dependencies.includes("pets"),
          has_evacuation_experience: hasEvacuationExperience,
        }),
      })
      const data = (await res.json()) as { ok?: boolean; playerId?: string; error?: string }
      if (!res.ok || !data.ok || !data.playerId) { toast.error(data.error ?? "Could not save profile"); return }
      setPlayerId(data.playerId)
      setProfile({
        nickname: nicknameForSave,
        age: String(validAge),
        gender,
        municipality: muni,
        dependencies,
        hasEvacuationExperience,
      })
      router.push("/play/questions")
    } catch {
      toast.error("Network error saving profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-6">
      {!isSimple && <div className="full-mode-only pointer-events-none absolute inset-0 -z-10 hidden md:block" aria-hidden>
        <span className="absolute left-[4%] top-[8%] h-7 w-7 rotate-12 border-2 border-black bg-fuchsia-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute left-[13%] top-[22%] h-0 w-0 rotate-[20deg] border-l-[13px] border-r-[13px] border-b-[22px] border-l-transparent border-r-transparent border-b-orange-300 drop-shadow-[2px_2px_0_#000]" />
        <span className="absolute left-[6%] top-[44%] h-9 w-9 rotate-45 border-2 border-black bg-lime-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute left-[11%] top-[66%] h-5 w-14 -rotate-6 border-2 border-black bg-yellow-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute left-[16%] bottom-[10%] h-7 w-7 -rotate-12 rounded-full border-2 border-black bg-emerald-300 shadow-[2px_2px_0_0_#000]" />

        <span className="absolute left-[26%] top-[2%] h-6 w-16 -rotate-[8deg] border-2 border-black bg-sky-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute left-[43%] top-[84%] h-6 w-6 rotate-[30deg] border-2 border-black bg-pink-300 shadow-[2px_2px_0_0_#000]" />

        <span className="absolute right-[2%] top-[5%] h-6 w-14 -rotate-12 rounded-full border-2 border-black bg-cyan-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[20%] top-[12%] h-7 w-7 rotate-45 border-2 border-black bg-lime-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[3%] top-[31%] h-8 w-8 -rotate-12 rounded-full border-2 border-black bg-rose-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[9%] top-[56%] h-9 w-9 rotate-12 border-2 border-black bg-violet-300 shadow-[2px_2px_0_0_#000]" />
        <span className="absolute right-[15%] bottom-[18%] h-0 w-0 -rotate-6 border-l-[15px] border-r-[15px] border-t-[22px] border-l-transparent border-r-transparent border-t-red-300 drop-shadow-[2px_2px_0_#000]" />
        <span className="absolute right-[5%] bottom-[8%] h-6 w-6 -rotate-12 border-2 border-black bg-amber-300 shadow-[2px_2px_0_0_#000]" />
      </div>}

      <div className="mx-auto w-full max-w-sm">

        {/* Header card */}
        <div className="mb-5 border-[3px] border-black bg-[#ffe129] shadow-[5px_5px_0_0_#000]">
          <div className="flex items-center justify-between border-b-[3px] border-black bg-black px-3 py-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ffe129]">Player Profile</span>
            <div className="flex gap-1">
              <span className="h-2.5 w-2.5 border-[1.5px] border-[#ffe129] bg-[#ff3b77]" />
              <span className="h-2.5 w-2.5 border-[1.5px] border-[#ffe129] bg-[#34e2cc]" />
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border-[3px] border-black bg-white shadow-[2px_2px_0_0_#000]">
              <UserRound className="h-10 w-10 text-black" strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-black">Tell us about yourself</p>
              <p className="mt-0.5 text-[10px] font-bold text-black/60">Fields marked <span className="text-[#ff2f75]">*</span> are required</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">

          {/* Nickname */}
          <div className="border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000]">
            <div className="border-b-[3px] border-black bg-[#34e2cc] px-3 py-1.5">
              <label htmlFor="nickname" className="text-[10px] font-black uppercase tracking-widest text-black">
                Nickname
              </label>
            </div>
            <div className="px-3 py-2.5">
              <input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                autoComplete="nickname"
                placeholder="e.g. ShadowFox"
                className="w-full border-[2px] border-black bg-[#f5f5f5] px-3 py-2 text-sm font-bold text-black placeholder:font-normal placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#ffe129] focus:ring-offset-1"
              />
            </div>
          </div>

          {/* Age */}
          <div className="border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000]">
            <div className="border-b-[3px] border-black bg-[#b784ea] px-3 py-1.5">
              <label htmlFor="age" className="text-[10px] font-black uppercase tracking-widest text-black">
                Age <span className="text-[#ff2f75]">*</span>
              </label>
            </div>
            <div className="px-3 py-2.5">
              <input
                id="age"
                type="text"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 28"
                autoComplete="bday-year"
                aria-required
                required
                className="w-full border-[2px] border-black bg-[#f5f5f5] px-3 py-2 text-sm font-bold text-black placeholder:font-normal placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#ffe129] focus:ring-offset-1"
              />
            </div>
          </div>

          {/* Municipality */}
          <div className="border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000]">
            <div className="border-b-[3px] border-black bg-[#ff3b77] px-3 py-1.5">
              <label htmlFor="municipality" className="text-[10px] font-black uppercase tracking-widest text-black">
                Municipality <span className="text-white">*</span>
              </label>
            </div>
            <div className="px-3 py-2.5">
              <FinnishMunicipalityInput
                id="municipality"
                value={municipality}
                onChange={setMunicipality}
                placeholder="e.g. Helsinki"
                className="w-full"
                inputClassName="w-full border-[2px] border-black bg-[#f5f5f5] px-3 py-2 text-sm font-bold text-black placeholder:font-normal placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#ffe129] focus:ring-offset-1"
                aria-required
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div className="border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000]">
            <div className="border-b-[3px] border-black bg-[#ffe129] px-3 py-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                Gender <span className="text-[#ff2f75]">*</span>
              </span>
            </div>
            <div className="flex gap-2 px-3 py-2.5" role="group" aria-label="Gender">
              {GENDERS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGender(value)}
                  className={`flex-1 border-[2.5px] border-black py-2 text-xs font-black uppercase tracking-wide transition-all ${
                    gender === value
                      ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                      : "bg-white text-black shadow-[2px_2px_0_0_#000] hover:bg-[#f0f0f0]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Dependants */}
          <div className="border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000]">
            <div className="border-b-[3px] border-black bg-[#34e2cc] px-3 py-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">Dependants</span>
            </div>
            <div className="px-3 py-2.5">
              <p className="mb-2.5 text-[10px] font-bold uppercase text-black/50">
                Anyone to care for during an emergency?
              </p>
              <div className="space-y-2">
                {DEPS.map(({ id, label, emoji }) => (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-center gap-3 border-[2.5px] border-black px-3 py-2 transition-all ${
                      dependencies.includes(id)
                        ? "bg-[#ffe129] shadow-none translate-x-[2px] translate-y-[2px]"
                        : "bg-white shadow-[2px_2px_0_0_#000] hover:bg-[#f9f9f9]"
                    }`}
                  >
                    <span className="text-lg leading-none">{emoji}</span>
                    <span className="text-sm font-black uppercase tracking-wide text-black">{label}</span>
                    <Checkbox
                      checked={dependencies.includes(id)}
                      onCheckedChange={() => toggleDep(id)}
                      className="ml-auto border-[2px] border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Evacuation experience */}
          <div className="border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000]">
            <div className="border-b-[3px] border-black bg-[#b784ea] px-3 py-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                Experience <span className="text-[#ff2f75]">*</span>
              </span>
            </div>
            <div className="px-3 py-2.5">
              <p className="mb-2.5 text-[10px] font-bold uppercase text-black/50">
                Any evacuation-related experience before?
              </p>
              <div className="flex gap-2" role="group" aria-label="Evacuation experience">
                {[
                  { val: true, label: "YES" },
                  { val: false, label: "NO" },
                ].map(({ val, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setHasEvacuationExperience(val)}
                    className={`flex-1 border-[2.5px] border-black py-2.5 text-sm font-black uppercase tracking-widest transition-all ${
                      hasEvacuationExperience === val
                        ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                        : "bg-white text-black shadow-[2px_2px_0_0_#000] hover:bg-[#f0f0f0]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 pb-8">
            <button
              type="submit"
              disabled={!canContinue || saving}
              className={`w-full border-[3px] border-black py-3.5 text-sm font-black uppercase tracking-widest transition-all ${
                canContinue && !saving
                  ? "bg-[#ff2f75] text-white shadow-[5px_5px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_#000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
                  : "cursor-not-allowed bg-[#ccc] text-black/40 shadow-[3px_3px_0_0_#999]"
              }`}
            >
              {saving ? "Saving…" : "Continue →"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}