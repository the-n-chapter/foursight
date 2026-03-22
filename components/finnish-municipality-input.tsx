"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { filterFinnishMunicipalities } from "@/lib/finnish-municipality"

interface FinnishMunicipalityInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  "aria-required"?: boolean
  required?: boolean
}

export function FinnishMunicipalityInput({
  id,
  value,
  onChange,
  placeholder,
  className,
  "aria-required": ariaRequired,
  required,
}: FinnishMunicipalityInputProps) {
  const [open, setOpen] = useState(false)

  const suggestions = useMemo(() => filterFinnishMunicipalities(value, 14), [value])

  return (
    <div className={cn("relative min-w-0", className)}>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-required={ariaRequired}
        required={required}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 200)
        }}
      />
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md"
          role="listbox"
        >
          {suggestions.map((name) => (
            <li key={name} role="option">
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(name)
                  setOpen(false)
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
