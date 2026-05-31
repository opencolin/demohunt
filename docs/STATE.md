# Demo Hunt — Current State

> Updated by each tick. Read this first if you're picking up cold.

## Last updated
2026-05-28T15:42:00Z (v0 + v1 + v2 all shipped)

## Active release
**Goal complete.** v0, v1, and v2 (council-revised wedges) are all live in production. Next agent picks the next priority from `docs/PLAN.md` or the deferred-features list at the bottom of `docs/releases/v2.md`.

## What's shipped (live at https://demohunt.vercel.app)

### Content
- **168 real demos** across 3 providers (YouTube / Loom / Mux)
- 109 hackathon imports (Cerebral Valley + ETHGlobal)
- 54 v0 source imports (Techstars Demo Day, AI Engineer World's Fair, Vercel HQ, Supabase, YC Founder Stories)
- 5 v1 Devpost imports (HackGPT projects)

### Mobile-first chrome
- 100dvh feed (correct viewport)
- Portrait + landscape view modes with localStorage persistence
- Mobile-landscape hides header / sidebar / back-link via `compact-hide` + `--header-h` CSS var
- J/K keyboard nav + up/down arrows on desktop
- View-mode switcher pill
- Mobile-friendly sidebar (`w-44` collapses cleanly)

### Discoverability
- Search across demos, founders, tags, badges
- Discover page with curated lists (Top Today, Rising, From Demo Days, AI-only)
- Founder profiles with badges, follower count, all demos
- Demo detail with related demos sidebar

### Sharing & growth (v0)
- OG cards + `twitter:player` cards on every `/demo/[id]` (Loom falls back to `summary_large_image`)
- Share button: `navigator.share` with clipboard fallback + toast
- `@vercel/analytics` mounted globally

### Contributor loop (v1)
- `/submit` works end-to-end: paste YouTube URL → oEmbed validation → thumbnail+title autofill → success screen with share moment
- `POST /api/submit` route with validation
- Pending submissions append to `data/pending-submissions.jsonl` (local) or log-only (Vercel read-only)
- 28 YouTube demos had their `durationSec` corrected via real `lengthSeconds` from watch pages

### Platform wedge (v2)
- **PWA**: `manifest.webmanifest` + dynamic `/icon` + `/apple-icon` + `share_target` so iOS share-sheet lands on `/submit?url=...&title=...&text=...`
- **Auth scaffold (env-gated)**: Sign in with Vercel OAuth wiring, Neon Postgres schema, env-gated DB helpers
  - `POST /api/upvote/[demoId]` and `POST /api/follow/[founderSlug]` return `{persisted:bool}`; client falls back to localStorage when `persisted:false`
  - `GET /api/auth/sign-in` returns 503 with `{error:'auth not configured'}` until VERCEL_OAUTH_CLIENT_ID + DATABASE_URL set
- **Digest scaffold**: Vercel cron at `0 16 * * *` UTC hits `/api/cron/digest`, no-ops without `RESEND_API_KEY`; `/subscribe` page POSTs to `/api/subscribe`, appends to `data/pending-subscribers.jsonl`

## Manual user steps required to fully activate v2

| Action | Why |
|---|---|
| Provision Neon Postgres via Vercel Marketplace integration | Persistent upvotes/follow + subscriber list |
| Run `db/schema.sql` against the new DB | Create tables |
| Set `DATABASE_URL` env (auto from integration) | DB helpers go live |
| Register a Sign in with Vercel OAuth app, set `VERCEL_OAUTH_CLIENT_ID` + `VERCEL_OAUTH_CLIENT_SECRET` | Sign-in flow goes live |
| Set `CRON_SECRET` env | Cron route accepts requests |
| Set `RESEND_API_KEY` env + verify a sender domain | Digest emails actually send |

Without these, the v2 surfaces are visible-but-no-op (graceful degradation by design — council requirement).

## Deferred features

See `docs/releases/v2.md` "Out of scope". Briefly: comments persistence, notifications, full follow graph, founder analytics, in-browser recording, AI pitch coaching cuts, Vercel Blob ingest. Each is a future release, gated on share-loop traction signals.

## Recent decisions

- Schedule wakeup minimum is 60s (used 60-600s ticks).
- v0 expanded BEYOND YC to Techstars/AI Engineer/Vercel/Supabase/YC Founder Stories because YC stopped publishing Demo Day publicly. Council approved.
- v1 cut from 8 sources to Devpost-first; only HackGPT hackathon yielded scrapable embeds.
- v2 re-sliced to thin wedge (PWA + auth-DB scaffold + digest scaffold). Real social graph + comments + AI tools deferred until traction proves the share loop.
- All three releases used worktree-isolated agents. v0 was single-agent (linear). v1 and v2 fanned out 3 agents in parallel; conflicts on `src/lib/data.ts` and `package.json` resolved by sequential merge in dependency order.

## Conventions for next agent

- Don't add fake/placeholder demos. Real video IDs only.
- Every new demo: `verified` field on its founder unless we can't source the link.
- New founders & demos go AT THE END of their arrays in `src/lib/data.ts`.
- API routes must gracefully no-op when env vars are missing — don't break the build.
- localStorage stays the source of truth for client UX; server persistence is best-effort enrichment.
