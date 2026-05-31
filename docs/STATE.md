# Demo Hunt — Current State

> Updated by each tick. Read this first if you're picking up cold.

## Last updated
2026-05-28T15:25:00Z (v0 shipped → v1 kickoff)

## Active release
**v1 — Curated contributor loop** (council-revised)

## What's shipped (live in prod at https://demohunt.vercel.app)
- **163 demos** across 3 video providers (YouTube/Loom/Mux). v0 added 54 new YouTube demos: Techstars Demo Day (13), AI Engineer World's Fair (12), Vercel HQ (10), Supabase (10), YC Founder Stories (9)
- OG cards + twitter:player on `/demo/[id]` — every demo is share-ready
- Share button — `navigator.share` with clipboard fallback and toast
- `@vercel/analytics` mounted in layout
- Next 16 viewport export (`themeColor: #0a0a0a`)
- Feed uses `100dvh` instead of `100vh` (correct mobile viewport)
- Mobile-landscape chrome-hidden mode (header / sidebar / back link)
- Portrait + landscape view modes, J/K keyboard nav, follow, upvote, search

## What's in progress
- v1 workflow about to spawn (3 worktree-isolated agents in parallel)

## Open tasks (in priority order)
1. **v1 — Devpost ingest** — scrape 2-3 top Devpost hackathons for projects with embedded YouTube videos
2. **v1 — wire `/submit` standalone** with YouTube oEmbed auto-fill, share-moment after submit
3. **v1 — backfill real durations** for existing 163 demos via oEmbed where possible
4. **v1 — dead-link check** — for each Loom/Mux/YouTube demo, HEAD the video URL; mark demos with broken embeds
5. **v2 — gated on traction**; queued

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
