# PM Council Verdict

**Date:** 2026-05-28

The PM Council convened to adjudicate scope for releases v0, v1, and v2 across three lenses: Velocity, Quality, and Distribution. Each lens returned per-release votes and flagged its single highest risk. A synthesis pass then reconciled the three into a final per-release decision and scope.

---

## PM verdicts

### Velocity

```json
{
  "top_risk": "v0's load-bearing claim — \"verified founder handles\" tied to funded companies — is fully manual with no source trail. At 80-150 demos it's an unbounded research sink that slips the deadline, and one wrong handle on a verified badge is a credibility hit later releases inherit.",
  "v0_vote": "ship_with_changes",
  "v0_changes": "Cut target to 40-60, not 80-150 — manual verification at the high end blows the week. Require a source-link per handle (YC profile or X); ship unverifiable ones as handle-less + verified:false instead of blocking. Keep YouTube-only + batch field. Repo has ~2 youtube vs 99 loom refs, so this is near-greenfield. No infra change; append in src/lib/data.ts.",
  "v1_vote": "ship_with_changes",
  "v1_changes": "Cut 8 sources to 1 (Devpost — cleanest embedded YouTube). Drop X threads, AGI House, MIT, Builder Club, Browser Use — manual scrapes, no API. KEEP /submit + oEmbed auto-fill (route shell exists at src/app/submit/page.tsx) and real durations — turns maintenance cost into a contributor pipeline. DEFER SQLite: the TS file isn't the bottleneck, pure cost.",
  "v2_vote": "reject",
  "v2_changes": "Reject as one release: ~12 greenfield backends (auth, follow, comments, notifs, AI cuts, in-browser record, Blob, Resend, cron, PWA, Postgres) on an app whose only deps are clsx/lucide/tailwind-merge. Re-slice. First wedge: Vercel auth + persistent upvotes/follow — makes existing upvote/follow button shells real. Rest ships later once retention is proven."
}
```

### Quality

```json
{
  "v0_vote": "ship_with_changes",
  "v0_changes": "Harden the data contract before chasing volume. All 109 demos are verified:false today, no batch field, seeded counts. Require verified:true + real batch + working YouTube ID per demo; block failures. Don't let \"YouTube only\" delete the 109 existing Loom/Mux demos — keep them or the feed goes net-negative and density (the moat) drops. Add the missing Next 16 viewport export; switch feed 100vh→dvh.",
  "v1_vote": "ship_with_changes",
  "v1_changes": "8 sources + auto-approved submission turns curation into generic aggregation. Plan says submit \"goes live immediately, no review\" — override that. /submit is a dead static form; wire it to a moderation queue, not the feed. Launch 2-3 best sources first (Devpost, AGI House), prove ingest+review, then add the tail. Ship oEmbed, real durations, SQLite. Add a dead-link check.",
  "v2_vote": "ship_with_changes",
  "v2_changes": "~7 products in one release on a zero-backend codebase: no API routes, no auth/DB/email/blob deps. Keep the moat wedge: Vercel auth + founder studio (script→AI cuts→record→Blob) + Resend digest + PWA. Cut comments + notifications + full follow-graph to later — generic engagement; upvote/follow are display-only stubs so it's greenfield anyway. Do Postgres before the social build.",
  "top_risk": "The moat (curation + mobile density) sits on a 109-row hand-seeded file with fabricated counts and verified:false everywhere. v0 can shrink the feed, v1 can flood it unvetted via auto-approve, and v2 stacks full auth/social/AI on a no-backend codebase — curation erodes as complexity peaks."
}
```

### Distribution

```json
{
  "v0_vote": "ship_with_changes",
  "v0_changes": "Real videos fine. But /demo/[id] routes already exist with no share surface: only starter SVGs in public/, no OG/twitter cards in src. While restructuring data, add generateMetadata with OG + twitter:player cards so a founder tweet renders a playable card. Add @vercel/analytics. Else real demos still aren't shareable.",
  "v1_vote": "ship_with_changes",
  "v1_changes": "Submit-via-oEmbed IS the viral loop: pull it forward, ship standalone, skip the 8-source + SQLite bundle. Make post-submit a share moment (auto share card + pre-filled tweet). For scraped sources, notify the founder who'll amplify. Multi-source scraping is reach-neutral; submission is the loop.",
  "v2_vote": "ship_with_changes",
  "v2_changes": "Mostly retention/infra, not acquisition. Pull PWA + iOS share-target forward (cheap reach); keep digests. Defer AI-coaching, record-in-browser, Blob, comments, Postgres: heavy, no viral mechanic. Gate on a metric: v0/v1 share loop driving sessions. No traction = don't build the platform.",
  "top_risk": "Roadmap backfills content + builds platform infra before any share loop exists. /demo/[id] routes exist but public/ has only starter SVGs, no OG/twitter cards, no share button, no analytics in src. Shared links show no playable card, so even real demos can't go viral."
}
```

---

## Synthesis decision

The three lenses converge: v0 and v1 **proceed** with adopted changes; v2 must be **revised** — re-sliced into a thin, traction-gated wedge rather than shipped as one release. Every adopted change below is backed by 2+ judges or a single high-severity flag.

### v0 — Real videos + data contract — **proceed**

Replace fake/embedded videos with real ones AND harden the data contract. Adopted changes (each backed by 2+ judges or a high-severity flag):

1. **Data contract:** every demo requires `verified:true` + real `batch` + working video ID; block entries that fail (VELOCITY+QUALITY). Add a per-handle source link (YC profile or X). Founder handles that can't be sourced ship handle-less + `verified:false` rather than blocking the demo (VELOCITY high-severity: avoid unbounded manual-research slip and a wrong verified badge).
2. **Do NOT go "YouTube-only"** in a way that deletes the existing ~109 Loom/Mux demos — keep them, add YouTube going forward. Purging guts feed density, the moat (QUALITY high-severity; corroborated by repo: 99 loom vs 2 youtube refs, all 109 `verified:false`).
3. **Target 40–60 demos**, not 80–150 — the high end blows the week (VELOCITY).
4. **Shareability** (DISTRIBUTION top-risk, high-severity): add `generateMetadata` with OG + `twitter:player` cards on `/demo/[id]`, add a share button, add `@vercel/analytics`; otherwise real demos still can't go viral.
5. **Correctness** (QUALITY): add the missing Next 16 viewport export; switch feed `100vh`→`dvh`.

No infra change; append demos in `src/lib/data.ts`. Net: a smaller, fully-verified, shareable feed that loses no existing content.

### v1 — Curated contributor loop — **proceed**

Re-scope from "8 sources + auto-approved submit + SQLite" to a curated contributor loop.

1. **Sources:** cut from 8 to Devpost-first (cleanest embedded YouTube); 2–3 max. Drop X threads, AGI House (tail), MIT, Builder Club, Browser Use — manual scrapes, no API (all 3 judges reject the 8-source bundle).
2. **Centerpiece:** pull `/submit` + oEmbed auto-fill forward and ship standalone — it is the viral/contributor loop (all 3 judges). Shell exists at `src/app/submit/page.tsx` (currently a dead static form; there are zero API routes today).
3. **Submissions must NOT auto-publish.** Override "goes live immediately, no review" — route to a moderation queue (QUALITY high-severity: auto-approve erodes the curation moat; DISTRIBUTION's founder-notify aligns).
4. **Post-submit share moment:** auto share card + pre-filled tweet, reusing v0's OG cards (DISTRIBUTION — the acquisition mechanic).
5. **Ship real video durations** via oEmbed (VELOCITY+QUALITY).
6. **Add a dead-link / dead-video check** (QUALITY).
7. **DEFER full SQLite catalog migration** — not the bottleneck, pure cost (VELOCITY+DISTRIBUTION). Carve-out: submissions need persistence, so back the moderation queue with the minimal store required (lightweight/Blob-backed, or Postgres if v2's DB lands first) — not a full catalog DB.

### v2 — Platform wedge (traction-gated) — **revise**

Do NOT ship v2 as one release — all 3 judges agree ~7–12 greenfield backends can't land together on a zero-backend codebase (deps today are only clsx/lucide/tailwind-merge; no API routes; auth/DB/email/blob all absent). Re-slice to a thin, traction-gated wedge.

**SHIP NOW (convergent wedge):**

- Vercel auth + persistent upvotes + persistent follow button — makes the existing display-only upvote/follow stubs real (VELOCITY's explicit first wedge + QUALITY + DISTRIBUTION).
- Postgres as the foundation for that persistence (QUALITY: "Postgres before the social build"); also satisfies v1's deferred submission-persistence need.
- PWA + iOS share-target + a basic Resend digest — cheap reach, the only acquisition mechanics in v2 (DISTRIBUTION pull-forward; QUALITY keeps PWA/digest).

**GATE:** the social build is conditional on v0/v1 share-loop driving sessions (DISTRIBUTION high-severity; VELOCITY "once retention is proven"). No traction = don't build the platform.

**DEFER** to a later, traction-gated release: comments (3/3), notifications (3/3), full follow-graph/feed (keep button persistence, defer the graph), AI cuts/coaching, in-browser record, Blob storage (VELOCITY+DISTRIBUTION).
