# FOURSIGHT — Technical overview

This document describes the stack, architecture, data flow, and operational requirements for the FOURSIGHT web application.

## Purpose

FOURSIGHT is a prototype **personality / crisis-archetype experience**: visitors consent to participate, submit a short demographic profile, answer scenario questions, and receive scores mapped to **archetype cards** along several behavioral dimensions. Public marketing pages and a wiki-style archetypes gallery sit alongside the interactive play flow.

## Stack

| Layer | Technology |
|--------|------------|
| Framework | [Next.js](https://nextjs.org/) 15.1 (App Router) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS 3.4, `tailwindcss-animate`, shadcn-style UI primitives (`components/ui/*`) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) (body), [Fraunces](https://fonts.google.com/specimen/Fraunces) as `font-personality` for display headings and card titles |
| Themes | `next-themes` (light/dark) |
| Client state (play flow) | [Zustand](https://zustand-demo.pmnd.rs/) with `persist` (localStorage) |
| Validation | [Zod](https://zod.dev/) in API routes |
| Database (game) | [Supabase](https://supabase.com/) (PostgreSQL) via `@supabase/supabase-js`, **service role** on the server only |
| Auth (legacy dashboard) | `next-auth`, JWT/bcrypt-related deps; dashboard routes use a separate UX from the public game |

Other notable libraries: Radix UI primitives, Lucide icons, Sonner toasts, Framer Motion, Recharts (dashboard), Axios.

## Repository layout (high level)

```
app/                    # App Router: pages, layouts, API route handlers
  (site)/               # Public site segment: GameNav, play, about, archetypes
  api/game/             # Game REST handlers (player, questions, submit, result-scores)
  dashboard/            # Authenticated dashboard (devices, settings, etc.)
  login/, signup/       # Account flows
components/             # Shared React components (nav, flip cards, game UI, etc.)
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
- **Dashboard** (`/dashboard/*`) — separate product surface (devices, settings); uses `MainNav` and localStorage-based user display where applicable.

Layouts:

- `app/(site)/layout.tsx` — wraps public play + about + archetypes with `GameNav`.
- `app/(site)/play/layout.tsx` — wraps play subtree with `PlayConsentGate`.

## Play flow and client state

1. **Consent** — `PlayConsentGate` + `useGameStore.setConsentAccepted`. Accepting consent starts a **new client session**: fresh `sessionToken` (`clientSessionId`), cleared profile, answers, and `playerId`.
2. **Profile** — User fills the form; client calls `POST /api/game/player` with `sessionToken` and profile fields. Server upserts a row in `players` and returns `playerId` (stored in Zustand).
3. **Questions** — `GET /api/game/questions` returns ordered questions and options (weights per dimension). Answers live in Zustand (`answers`, `otherAnswers` for free-text “other” options).
4. **Submit** — Client sends `POST /api/game/submit` with `sessionToken` and `decisions` (per question: either `optionId` or `otherText`). Server resolves scores, replaces `decisions` for that player, and persists rows.
5. **Result** — `GET /api/game/result-scores?sessionToken=…` loads decisions, computes averages and **dominant dimension**, drives result UI and archetype mapping (`lib/personality-cards.ts`, `lib/dimension-scoring.ts`, `lib/dominant-dimension.ts`).

Zustand persistence key and shape are defined in `lib/stores/use-game-store.ts` (includes `consentAccepted`, `clientSessionId`, `playerId`, `profile`, answers).

## HTTP API (game)

All handlers live under `app/api/game/`. They use `getSupabaseAdmin()` from `lib/supabase/admin.ts`. If Supabase env vars are missing, routes respond with **503** and a short error message.

| Method & path | Role |
|---------------|------|
| `POST /api/game/player` | Create or update `players` by `session_token`; validates age, gender, Finnish municipality. |
| `GET /api/game/questions` | List `questions` with embedded `options`, ordered by `order_index`. `dynamic = "force-dynamic"`. |
| `POST /api/game/submit` | Validates payload; ensures player exists; writes `decisions` (deletes prior rows for player then inserts). |
| `GET /api/game/result-scores` | Query param `sessionToken`; reads `decisions`; returns averages, dominant dimension, count. `dynamic = "force-dynamic"`. |

Request/response shapes and row types are aligned with `lib/types/game-api.ts` and related scoring helpers.

## Supabase / data model (as used in code)

Server code expects PostgreSQL tables (names from queries):

- **`players`** — e.g. `session_token`, profile fields (`nickname`, `age`, `gender`, `municipality`, dependency flags), identifiers.
- **`questions`** — `id`, `order_index`, `question_text`; related **`options`** with `option_key`, `option_text`, and weight columns `weight_react`, `weight_trust`, `weight_indep`, `weight_adapt`, `weight_mobil`, `weight_safety`.
- **`decisions`** — per answer: link to `player_id`, chosen option / “other” handling, and stored score columns (`score_*`) as produced on submit.

**Security note:** The app uses the **service role** key only in server-side route handlers. It bypasses RLS; do not expose this key to the client. Row Level Security and anon keys are appropriate for any future direct browser access, which this game API path does not rely on today.

## Environment variables

| Variable | Scope | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public name; used server-side | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin API access for game routes |
| `NEXT_PUBLIC_API_URL` | Optional | Overrides default REST base in `lib/config.ts` (default points at an external API host for non-game features) |

For local development, use `.env.local` (not committed). Production (e.g. Vercel) must define the Supabase variables or game endpoints return 503.

## Build and quality

- **Develop:** `npm run dev` — Next dev with Turbopack.
- **Production build:** `npm run build` then `npm run start`.
- **Lint:** `npm run lint` (Next ESLint; builds may skip lint via legacy `next.config.js` options if both config files are present — prefer a single merged Next config).
- **Tests:** `npm run test` (Jest).

### Icons / metadata

`app/icon.svg` supplies the App Router metadata icon. Avoid shipping a stale `favicon.ico` that overrides it unless intentional.

## Deployment notes (e.g. Vercel)

- Framework preset: **Next.js**.
- Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the project environment.
- Ensure Node version matches the one used locally (see `package.json` / Vercel defaults).
- If the build log stops during “Collecting build traces,” check Vercel build logs for OOM or timeout; clearing cache or raising memory limits can help on large dependency trees.

## Related files (quick reference)

- Scoring & dimensions: `lib/dimension-scoring.ts`, `lib/dominant-dimension.ts`, `lib/personality-cards.ts`, `lib/data/game-db.ts` (`DIMENSION_WIKI`).
- Submit pipeline: `lib/submit-game-decisions.ts` (if used from client utilities), `app/api/game/submit/route.ts`.
- Finnish municipalities: `lib/finnish-municipality.ts`, `components/finnish-municipality-input.tsx`.

---

*Last updated to match the repository layout and dependencies as of the document’s creation; adjust when schema or routes change.*
