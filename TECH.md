# FOURSIGHT — Technical overview

This document describes the stack, architecture, data flow, and operational requirements for the FOURSIGHT web application.

## Purpose

FOURSIGHT is a prototype **personality / crisis-archetype experience**: visitors consent to participate, submit a short demographic profile, answer scenario questions, and receive scores mapped to **archetype cards** along several behavioral dimensions. Public marketing pages and a wiki-style archetypes gallery sit alongside the interactive play flow.

## Stack

| Layer | Technology |
|--------|------------|
| Framework | [Next.js](https://nextjs.org/) 15.5 (App Router) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS 3.4, `tailwindcss-animate`, shadcn-style UI primitives (`components/ui/*`) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) (body), [Fraunces](https://fonts.google.com/specimen/Fraunces) as `font-personality` for display headings and card titles |
| Visual modes | **`full`** vs **`simple`** via `next-themes` (not a light/dark pair). Wiring: `components/providers.tsx`, toggle `components/mode-toggle.tsx`; tokens in `app/globals.css` (`:root` vs `.simple`). |
| Client state (play flow) | [Zustand](https://zustand-demo.pmnd.rs/) with `persist` (localStorage) |
| Validation | [Zod](https://zod.dev/) in API routes |
| Database (game) | [Supabase](https://supabase.com/) (PostgreSQL) via `@supabase/supabase-js`, **service role** on the server only |

Radix UI, Lucide, Sonner toasts, and Framer Motion back the UI; Recharts appears in reusable chart primitives. Dependencies such as **`next-auth`**, Axios, bcryptjs/JWT, and components that link to **`/dashboard/*`** (`components/main-nav.tsx`, notifications) remain in the repo but **have no matching pages under `app/`** — the active App Router surface is `/`, `/about`, `/archetypes`, `/play/*`, and **`/api/game/*` only.**

### Visual modes (full vs simple)

- **`full`** — default (`defaultTheme="full"`). Uses base `:root` CSS variables and the layered radial background on `body`; decorative shadows and richer surfaces where used.
- **`simple`** — `class="simple"` on the document from `next-themes`. Overrides tokens under `.simple` in `app/globals.css`, removes the page gradient, strips box/text shadows broadly, hides elements marked `.full-mode-only`, and biases toward simpler chrome.
- **`enableSystem`** is **`false`**; only `full` and `simple` are registered (`themes={["full", "simple"]}`).
- A `.dark` ruleset still exists in `app/globals.css` for compatibility with Tailwind's `darkMode: ["class"]`, but the live theme switcher does **not** toggle `dark`; it only switches **full/simple**.

## Repository layout (high level)

```
app/                    # App Router: root layout + pages
  page.tsx              # Landing
  globals.css           # Design tokens (:root), .simple overrides; legacy `.dark` block unused by ThemeProvider
  (site)/               # Public segment: GameNav, play, about, archetypes
  api/game/             # REST: player, questions, submit, result-scores
components/             # GameNav, ModeToggle, theme provider, flip cards, game UI, shadcn-style ui/*
lib/                    # Domain logic, Supabase admin client, scoring, stores, types
public/                 # Static assets (logos, images)
```

## User-facing routes

- **Marketing / entry**: `/` — landing, entry into play.
- **Public content**: `/about`, `/archetypes` — static-style pages; archetypes use `ArchetypeFolderGallery` and `personality-flip-card`.
- **Play** (under `(site)` layout + consent gate):
  - `/play/profile` — nickname, age, gender, Finnish municipality (validated list), household dependencies.
  - `/play/questions` — folder-style question stack; loads questions from API.
  - `/play/result` — loads aggregated scores and presents archetype result UI.

Layouts:

- `app/(site)/layout.tsx` — wraps public play + about + archetypes with `GameNav` (home, about, archetypes links + **full/simple** mode toggle).
- `app/(site)/play/layout.tsx` — wraps play subtree with `PlayConsentGate`.

## Play flow and client state

1. **Consent** — `PlayConsentGate` + `useGameStore.setConsentAccepted`. Accepting consent starts a **new client session**: fresh `sessionToken` (`clientSessionId`), cleared profile, answers, and `playerId`.
2. **Profile** — User fills the form; client calls `POST /api/game/player` with `sessionToken` and profile fields. Server upserts a row in `players` and returns `playerId` (stored in Zustand).
3. **Questions** — `GET /api/game/questions` returns ordered questions and options (weights per dimension). Answers live in Zustand (`answers` as selected option IDs per question).
4. **Submit** — Client sends `POST /api/game/submit` with `sessionToken` and `decisions` (per question: `optionId` only). Server resolves scores, replaces `decisions` for that player, and persists rows.
5. **Result** — `GET /api/game/result-scores?sessionToken=...` loads decisions, computes averages and **dominant dimension**, drives result UI and archetype mapping (`lib/personality-cards.ts`, `lib/dimension-scoring.ts`, `lib/dominant-dimension.ts`).

Zustand persistence key and shape are defined in `lib/stores/use-game-store.ts` (includes `consentAccepted`, `clientSessionId`, `playerId`, `profile`, answers).

## HTTP API (game)

All handlers live under `app/api/game/`. They use **`getSupabaseAdmin()`** from `lib/supabase/admin.ts`.

**Responses when Supabase is unavailable:**

- **503** — Environment variables were missing **at request time**, so no admin client could be created. Production message text is abbreviated ("Supabase is not configured."); local development returns a hint to add `.env.local` entries.
- **500** with a generic **"Database error"** (or similar) — The admin client ran a query and PostgreSQL / PostgREST returned an error. Check the **terminal running `npm run start` (or the host logs)** for lines prefixed `[game/player]`, `[game/questions]`, `[game/submit]`, or `[game/result-scores]`; those log Supabase's real error message.

| Method & path | Role |
|---------------|------|
| `POST /api/game/player` | Create or update `players` by `session_token`; validates age, gender, Finnish municipality. |
| `GET /api/game/questions` | List `questions` with embedded `options`, ordered by `order_index`. `dynamic = "force-dynamic"`. |
| `POST /api/game/submit` | Validates payload; ensures player exists; writes `decisions` (deletes prior rows for player then inserts). |
| `GET /api/game/result-scores` | Query param `sessionToken`; reads `decisions`; returns averages, dominant dimension, count. `dynamic = "force-dynamic"`. |

Request/response shapes and row types are aligned with `lib/types/game-api.ts` and related scoring helpers.

## Supabase / data model (as used in code)

Server code expects PostgreSQL tables (names from queries):

- **`players`** — e.g. `session_token`, profile fields (`nickname`, `age`, `gender`, `municipality`, dependency flags, `has_evacuation_experience`), identifiers.
- **`questions`** — `id`, `order_index`, `question_text`; related **`options`** with `option_key`, `option_text`, and weight columns `weight_react`, `weight_trust`, `weight_indep`, `weight_adapt`, `weight_mobil`, `weight_safety`, `weight_commu`, `weight_prep`.
- **`decisions`** — per answer: link to `player_id`, chosen option key, and stored score columns (`score_react`, `score_trust`, `score_indep`, `score_adapt`, `score_mobil`, `score_safety`, `score_commu`, `score_prep`) as produced on submit.

**Security note:** The app uses the **service role** key only in server-side route handlers. It bypasses RLS; do not expose this key to the client. Row Level Security and anon keys are appropriate for any future direct browser access, which this game API path does not rely on today.

**Admin client behavior:** `getSupabaseAdmin()` creates a lazily initialized Supabase JS client keyed from `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (values are trimmed after read). Only a successful client is memoized for the Node process lifetime; **`null` from missing env is not cached**, so env can become valid later in the same process without restarting.

## Environment variables

| Variable | Scope | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public **name**; also read server-side | Supabase project URL (inlined into client bundles at **build time** where referenced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin API access for game routes (never inlined; supply at **runtime** on the host process) |
| `NEXT_PUBLIC_API_URL` | Optional | Overrides default REST base in `lib/config.ts` (default points at an external API host for non-game features) |

- **Local:** Put secrets in `.env.local` (not committed). Restart the dev server or `next start` after editing env files so `process.env` picks up changes.
- **Hosted (e.g. Vercel):** Define the Supabase variables in the dashboard for **Production** (and Preview if you run the game flow there). `.env.local` from your machine is not deployed—omitted variables yield **503** on game APIs.

Using `npm run build` followed by **`npm run start` on the same machine** reads `.env.local` like development, as long as you run `start` from the project root; if the UI still fails while dev works, compare env effective at runtime with the troubleshooting notes under **HTTP API (game)** above.

## Build and quality

- **Develop:** `npm run dev` — Next dev with Turbopack.
- **Production build:** `npm run build` then `npm run start`.
- **Lint:** `npm run lint` (Next ESLint; production builds skip ESLint when `eslint.ignoreDuringBuilds` is set in `next.config.ts`).
- **Tests:** `npm run test` (Jest).
- **Favicons:** None — root `metadata.icons` uses empty `icon`, `apple`, and `shortcut` arrays so Next does not emit favicon or touch-icon links. Do not add `app/icon*`, `app/favicon.ico`, or `public/favicon.ico` unless you intentionally restore icons.

## Deployment notes (e.g. Vercel)

- Framework preset: **Next.js**.
- Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the project environment for each environment where the play flow runs. Redeploy after changing secrets.
- Prefer the **service role** secret from Supabase → Project Settings → API (JWT `eyJ…` legacy keys or newer `sb_secret_…`-style secrets both work with `@supabase/supabase-js`; avoid pasting anon or publishable keys here).
- Ensure Node version matches the one used locally (see `package.json` / platform defaults).
- If the build log stops during “Collecting build traces,” check build logs for OOM or timeout; clearing cache or raising memory limits can help on large dependency trees.

## Related files (quick reference)

- Scoring & dimensions: `lib/dimension-scoring.ts`, `lib/dominant-dimension.ts`, `lib/personality-cards.ts`, `lib/data/game-db.ts` (`DIMENSION_WIKI`).
- Submit pipeline: `lib/submit-game-decisions.ts` (if used from client utilities), `app/api/game/submit/route.ts`.
- Finnish municipalities: `lib/finnish-municipality.ts`, `components/finnish-municipality-input.tsx`.

---

*Last updated: visual modes documented as full/simple; repository layout and routes aligned with current `app/` tree; Supabase and build notes as above.*
