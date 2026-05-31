# Demo Hunt — Current State

> Updated by each tick. Read this first if you're picking up cold.

## Last updated
2026-05-28T08:30:00Z (initial goal kickoff)

## Active release
**v0 — Real YC + real YouTube demos**

## What's shipped (live in prod at https://demohunt.vercel.app)
- 109 real demos across 3 video providers (YouTube/Loom/Mux)
- Mobile-landscape chrome-hidden mode
- Search, follow, upvote, J/K nav, view-mode switcher
- 8 founders with verified badges, ~89 hackathon builders

## What's in progress
- PM Council workflow drafting v0/v1/v2 scope (about to spawn)
- v0 source agents (about to spawn after council resolves)

## Open tasks (in priority order)
1. **PM Council** — get scope verdicts on v0, v1, v2 before kicking off implementation
2. **v0 — YC YouTube channel scrape** — find all demo day playlists W23..W26, extract individual demo videos and presenting founder
3. **v0 — YC company directory enrichment** — map each scraped video to a current YC company profile (real founder name, batch, company URL)
4. **v0 — Add 80-150 YC demos to `src/lib/data.ts`** with `videoProvider: 'youtube'` and real YC batch tags
5. **v0 — QA pass** — every new demo loads, has a real founder, has a real company URL
6. **v0 — Ship to prod**

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
