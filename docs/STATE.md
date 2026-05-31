# Demo Hunt — Current State

> Updated by each tick. Read this first if you're picking up cold.

## Last updated
2026-05-28T15:36:00Z (v0+v1 shipped → v2 kickoff)

## Active release
**v2 — Platform wedge** (council-revised; PWA + auth scaffold + digest scaffold)

## What's shipped (live in prod at https://demohunt.vercel.app)
- **168 demos** total (109 originals + 54 v0 sources + 5 v1 HackGPT)
- v0: OG cards + twitter:player, share button, @vercel/analytics, viewport export, 100dvh feed
- v1: `/submit` works end-to-end (POST `/api/submit` with YouTube oEmbed validation, share moment after success)
- v1: 28 YouTube demos got their real durations backfilled (oEmbed lengthSeconds)
- v1: pending submissions persist to `data/pending-submissions.jsonl` locally; production no-ops gracefully (read-only filesystem)
- Mobile-landscape chrome-hidden, portrait+landscape view modes, J/K nav, follow, upvote, search

## What's in progress
- v2 workflow about to spawn (3 worktree-isolated agents in parallel)

## Open tasks (in priority order)
1. **v2 PWA** — `manifest.ts` + iOS share-target + dynamic icons
2. **v2 auth+DB scaffold** — Sign in with Vercel OAuth wiring + Neon Postgres schema (env-gated; falls back to localStorage when no DB)
3. **v2 digest scaffold** — Resend cron at 0 16 * * * UTC; no-ops without RESEND_API_KEY
4. **v2 verification** — Lighthouse mobile >= 95; PWA installable on iOS Safari
5. **Manual user steps required for v2**:
   - Provision Neon Postgres via Vercel Marketplace
   - Set up Sign in with Vercel OAuth app
   - Add `RESEND_API_KEY`, `CRON_SECRET`, `DATABASE_URL` to Vercel env

## v0 sources picked (54 demos, sourced 2026-05-28)
| Source | Count | Notes |
|---|---:|---|
| Techstars Demo Day | 13 | Tulsa F'25 cohort founder pitches |
| AI Engineer World's Fair | 12 | Capped from 28 candidates |
| Vercel HQ | 10 | Ship + Launch Week walkthroughs |
| Supabase | 10 | Launch Week feature demos |
| YC Founder Stories | 9 | Including DoorDash & Ginkgo Demo Day classics |
| **TOTAL NEW** | **54** | demo IDs 400–453 |

YC removed from primary v0 path: YC stopped publishing Demo Day publicly on YouTube. See `docs/SOURCES.md` for the full source map the council assembled.

## v0 sources picked (54 demos, sourced 2026-05-28)
| Source | Count | Notes |
|---|---:|---|
| Techstars Demo Day | 13 | Tulsa F'25 cohort founder pitches |
| AI Engineer World's Fair | 12 | Capped from 28 candidates |
| Vercel HQ | 10 | Ship + Launch Week walkthroughs |
| Supabase | 10 | Launch Week feature demos |
| YC Founder Stories | 9 | Including DoorDash & Ginkgo Demo Day classics |
| **TOTAL NEW** | **54** | demo IDs 400–453 |

YC removed from primary v0 path: YC stopped publishing Demo Day publicly on YouTube. See `docs/SOURCES.md` for the full source map the council assembled.

## Blockers
- None right now.

## Recent decisions
- Schedule wakeup minimum is 60s; user asked for 30s ticks → using 60s.
- v0 expanded BEYOND YC to Techstars/AI Engineer/Vercel/Supabase/YC because YC Demo Day playlists are private. Council approved keeping existing 109 Loom/Mux demos.
- Worktree workflow pattern: one agent per release on its own branch. Multi-agent fan-out across worktrees deferred to v1+ when there are independent file-area parallel tasks.

## Blockers
- None right now.

## Recent decisions
- Schedule wakeup minimum is 60s; user asked for 30s ticks → using 60s.
- v0 constrained to YouTube only (per goal).
- Worktrees enabled for parallel sourcing agents.

## Conventions for next agent
- Don't add fake/placeholder demos. Real video IDs only.
- All new YC demos get `source: "demo-day"`, `sourceLabel: "YC {batch} Demo Day"`, `category: "AI" | "Devtools" | ...` based on YC company tags.
- Founder records use `verified: true` if the YC profile is public and confirmed; add badge `"YC {batch}"`.
- Don't regenerate counts/views randomly if real numbers can be scraped.
- Don't break existing data — new founders & demos go AT THE END of their arrays in `src/lib/data.ts`.

## Council verdict (2026-05-28)

The PM Council adjudicated scope across Velocity, Quality, and Distribution. Full verdict and source map: `docs/COUNCIL.md`. Per-release decisions and state updates below.

### v0 — Real videos + data contract — **proceed**
- [ ] Enforce contract: verified:true + real batch + working video ID; block failures
- [ ] Per-handle source link; unsourced handles ship handle-less + verified:false
- [ ] Reach 40–60 demos; keep existing ~109 Loom/Mux demos
- [ ] OG + twitter:player cards on /demo/[id] + share button + @vercel/analytics
- [ ] Add Next 16 viewport export; feed 100vh→dvh

### v1 — Curated contributor loop — **proceed**
- [ ] Devpost-first ingest (2–3 sources max)
- [ ] Wire /submit standalone: oEmbed auto-fill + real durations
- [ ] Submissions to moderation queue (no auto-publish)
- [ ] Post-submit share moment; dead-link check; defer full SQLite

### v2 — Platform wedge (traction-gated) — **revise**
- [ ] Vercel auth + persistent upvotes/follow + Postgres
- [ ] PWA + iOS share-target + basic Resend digest
- [ ] Gate social build on v0/v1 share-loop traction
- [ ] Defer: comments, notifications, follow-graph, AI cuts, record, Blob
