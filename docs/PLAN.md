# Demo Hunt — Multi-Release Plan

> Mission: the best mobile-first place on the internet to watch real founder demo videos. Doomscroll for VCs, hackers, and curious nerds.

## Where we are today (2026-05-28)

- **Live**: https://demohunt.vercel.app
- **Repo**: github.com/opencolin/demohunt (`main`)
- **Stack**: Next.js 16 App Router, Tailwind v4, Vercel Functions, no DB
- **Data model**: in-memory arrays in `src/lib/data.ts` (109 demos, 89 founders)
- **Sources currently imported**:
  - Cerebral Valley × 5 hackathons → 48 Loom videos
  - ETHGlobal Open Agents × 5 pages → 61 Mux videos
  - 0 YC content (next target)
- **Providers supported**: `youtube`, `loom`, `mp4` (Mux)
- **Mobile**: phone-landscape hides chrome (header / sidebar / back link); phone-portrait card snap-scrolls
- **Features**: feed (portrait + landscape), discover, demo days, founder pages, search, follow, upvotes, progress bar, J/K nav

## Release roadmap

### v0 — Real YC + real YouTube demos (target: end of this week)
- Scope: replace remaining test data with real YC demo videos pulled from the YC YouTube channel and per-batch demo day playlists
- Constraint: YouTube only for v0 (per goal)
- Output: ~80-150 net-new YC demos with verified founder handles
- Acceptance: every demo on home feed playable and tied to a real, currently-funded company; per-demo metadata includes batch (W24 / S24 / F24 / W25 / S25 / F25 / W26)
- Owner agents: `sourcer-yc`, `enricher-yc`, `qa-bot`
- See: `docs/releases/v0.md`

### v1 — Multi-source aggregation + creator pipeline (target: +2 weeks)
- Scope: add demos from Devpost, AI Tinkerers, AGI House, MIT AI Studio, Anthropic Builder Club, Y Combinator Launches, Browser Use demos, founder X/Twitter pitch threads
- Add a one-click "Submit your YouTube/Loom link" workflow (no review, auto-approved if metadata extractable)
- Add per-demo durations from real video metadata (oEmbed / Mux API)
- Build a simple SQLite-backed persistence so a single PR can append demos
- See: `docs/releases/v1.md`

### v2 — Platform features (target: +6 weeks)
- Authenticated profiles with real follow graph, comments, notifications
- Founder dashboard: upload pitch script → AI coaching cuts → record-in-browser
- Daily / weekly / monthly email digest (Resend or Vercel-native)
- Mobile PWA wrapped install banner, iOS share-target intent
- See: `docs/releases/v2.md`

## Decision framework — "Mode Council"

When a release scope decision needs taste judgment, fan out three judges in parallel:

1. **PM Velocity** — what ships fastest with the least new surface area?
2. **PM Quality** — what creates the most defensible UX moat?
3. **PM Distribution** — what unlocks viral or organic reach?

Each returns a JSON verdict `{recommendation, rationale, score 0-10}`. A fourth agent synthesizes. If two of three agree the change is in-scope, ship it. If split, defer to the next release.

The council pattern is implemented as a Workflow script — see `docs/workflows/pm-council.md`.

## Worktree convention

Long-running implementation workflows run with `isolation: 'worktree'` so per-agent file mutations don't collide. Each release gets its own branch:

- `release/v0-yc-import`
- `release/v1-multi-source`
- `release/v2-platform`

Sub-agents inside a release workflow run in their own short-lived worktrees, merged back into the release branch after structured-output validation. Merging into `main` is a manual action; the workflow only opens the PR.

## Tick cadence

A 30-second self-tick (clamped to runtime min 60s) checkpoints progress and resumes any halted work. Each tick:

1. Read `docs/STATE.md` (most recent completed steps)
2. Identify the highest-priority open task in current release
3. Spawn the smallest possible agent to advance one step
4. Update `docs/STATE.md` with what shipped and what's next

## Handoff contract

Every agent (human or AI) picking this up cold can read these three files and resume:

- `docs/PLAN.md` (this file) — the why and the strategy
- `docs/STATE.md` — current concrete progress, open tasks, blockers
- `docs/releases/v{N}.md` — per-release scope, acceptance, owner agents

Nothing else is required for continuity. Conversation history is bonus, not required.
