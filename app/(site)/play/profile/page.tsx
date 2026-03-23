"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FinnishMunicipalityInput } from "@/components/finnish-municipality-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

const DEPS: { id: DependencyId; label: string }[] = [
  { id: "children", label: "Children" },
  { id: "elderly", label: "Elderly" },
  { id: "pets", label: "Pets" },
]

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      {" "}
      *
    </span>
  )
}

/** Labels in a fixed column; controls use remaining width so rows like gender fit one line. */
const formGrid =
  "mx-auto mt-4 grid w-full max-w-[21.33rem] grid-cols-[7.25rem_1fr] items-center gap-x-3 gap-y-5 sm:max-w-sm sm:grid-cols-[8rem_1fr]"
const labelCell =
  "flex min-h-9 min-w-0 items-center text-sm font-medium leading-none"
const controlCell = "min-w-0"
/** Full width of the control column. */
const fieldControlClass = "h-9 w-full min-w-0"

export default function PlayProfilePage() {
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
  const [saving, setSaving] = useState(false)

  const toggleDep = (id: DependencyId) => {
    setDependencies((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const resolvedMunicipality = resolveFinnishMunicipality(municipality)
  const validAge = parseValidAge(age)
  const canContinue = Boolean(gender && validAge !== null && resolvedMunicipality)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gender) {
      toast.error("Please select a gender.")
      return
    }
    if (validAge === null) {
      toast.error("Age must be a whole number between 1 and 120.")
      return
    }
    const muni = resolveFinnishMunicipality(municipality)
    if (!muni) {
      toast.error("Choose your municipality from the list (use the suggestions while typing).")
      return
    }

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
        }),
      })
      const data = (await res.json()) as { ok?: boolean; playerId?: string; error?: string }
      if (!res.ok || !data.ok || !data.playerId) {
        toast.error(data.error ?? "Could not save profile")
        return
      }
      setPlayerId(data.playerId)
      setProfile({
        nickname: nicknameForSave,
        age: String(validAge),
        gender,
        municipality: muni,
        dependencies,
      })
      router.push("/play/questions")
    } catch {
      toast.error("Network error saving profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-4">
      <div className="relative h-36 w-full max-w-xs sm:h-40">
        <Image
          src="/images/profile.png"
          alt=""
          fill
          className="object-contain object-center"
          sizes="(max-width: 640px) 100vw, 28rem"
          priority
        />
      </div>

      <form
        onSubmit={submit}
        className={formGrid}
      >
        <Label htmlFor="nickname" className={labelCell}>
          Nickname
        </Label>
        <div className={controlCell}>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoComplete="nickname"
            className={fieldControlClass}
          />
        </div>

        <Label htmlFor="age" className={labelCell}>
          Age
          <RequiredMark />
        </Label>
        <div className={controlCell}>
          <Input
            id="age"
            type="text"
            inputMode="numeric"
            value={age}
            onChange={(e) => {
              const next = e.target.value.replace(/\D/g, "")
              setAge(next)
            }}
            placeholder="e.g. 28"
            autoComplete="bday-year"
            aria-required={true}
            required
            className={fieldControlClass}
          />
        </div>

        <Label htmlFor="municipality" className={labelCell}>
          Municipality
          <RequiredMark />
        </Label>
        <div className={controlCell}>
          <FinnishMunicipalityInput
            id="municipality"
            value={municipality}
            onChange={setMunicipality}
            placeholder="e.g. Helsinki"
            className="w-full"
            aria-required={true}
            required
          />
        </div>

        <Label id="profile-gender-label" className={labelCell}>
          Gender
          <RequiredMark />
        </Label>
        <div
          className={`${controlCell} flex flex-nowrap content-center gap-1.5`}
          role="group"
          aria-labelledby="profile-gender-label"
        >
          {GENDERS.map(({ value, label }) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={gender === value ? "default" : "outline"}
              className="h-7 shrink-0 rounded-full px-2.5 text-xs sm:h-8 sm:px-3 sm:text-sm"
              onClick={() => setGender(value)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="min-w-0 self-start space-y-1.5">
          <Label className="text-sm font-medium leading-none">Dependants</Label>
          <p className="text-xs font-normal leading-snug text-muted-foreground">
            Do you have anyone to take care of during the emergency situation? Select all that apply.
          </p>
        </div>
        <div className={`${controlCell} self-start space-y-1.5`}>
          {DEPS.map(({ id, label }) => (
            <label
              key={id}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border border-border px-2.5 py-2 hover:bg-accent/50"
            >
              <Checkbox checked={dependencies.includes(id)} onCheckedChange={() => toggleDep(id)} />
              <span className="text-sm font-medium">{label}</span>
            </label>
          ))}
        </div>

        <div className="col-span-2 flex justify-center pt-8">
          <Button
            type="submit"
            className="h-9 shrink-0 rounded-full px-7 text-sm"
            size="default"
            disabled={!canContinue || saving}
          >
            {saving ? "Saving…" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  )
}
