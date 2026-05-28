export type Founder = {
  slug: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  email: string;
  links: { label: string; url: string }[];
  tags: string[];
  verified?: boolean;
  badges?: string[];
  followers?: number;
};

export type Demo = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  founderSlug: string;
  youtubeId: string;
  durationSec: number;
  category: string;
  tags: string[];
  upvotes: number;
  views: number;
  comments: number;
  postedAt: string;
  source: "founder" | "demo-day" | "hackathon" | "ai-generated";
  sourceLabel?: string;
};

export type DemoDay = {
  id: string;
  slug: string;
  name: string;
  host: string;
  date: string;
  city: string;
  venue: string;
  format: "in-person" | "online" | "hybrid";
  blurb: string;
  registerUrl: string;
  capturedBy?: "demohunt" | "host";
  demoCount: number;
};

export type FeedTab = {
  key: string;
  label: string;
};

export const FEED_TABS: FeedTab[] = [
  { key: "for-you", label: "For You" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "rising", label: "Rising" },
  { key: "ai", label: "AI Only" },
];

export const founders: Founder[] = [
  {
    slug: "amelia-okafor",
    name: "Amelia Okafor",
    handle: "ameliao",
    avatar: "AO",
    bio: "Building Cluely-style real-time copilots for sales calls. Ex-Stripe.",
    location: "San Francisco, CA",
    email: "amelia@livesignal.app",
    links: [
      { label: "livesignal.app", url: "https://livesignal.app" },
      { label: "x.com/ameliao", url: "https://x.com/ameliao" },
    ],
    tags: ["AI", "Sales", "B2B"],
    verified: true,
    badges: ["Ex-Stripe", "YC W26"],
    followers: 1240,
  },
  {
    slug: "vikram-shastri",
    name: "Vikram Shastri",
    handle: "vshastri",
    avatar: "VS",
    bio: "Devtools for AI agents. Open source maintainer. YC W24.",
    location: "San Francisco, CA",
    email: "vik@orbitlab.dev",
    links: [
      { label: "orbitlab.dev", url: "https://orbitlab.dev" },
      { label: "github.com/vshastri", url: "https://github.com/vshastri" },
    ],
    tags: ["Devtools", "Open Source", "Agents"],
    verified: true,
    badges: ["YC W24", "Anthropic Builder Club"],
    followers: 3870,
  },
  {
    slug: "jules-tan",
    name: "Jules Tan",
    handle: "julestan",
    avatar: "JT",
    bio: "Hardware founder. Tabletop robots for kids. Frontier Tower resident.",
    location: "San Francisco, CA",
    email: "jules@kidlab.co",
    links: [{ label: "kidlab.co", url: "https://kidlab.co" }],
    tags: ["Hardware", "Robotics", "Consumer"],
    badges: ["Frontier Tower"],
    followers: 612,
  },
  {
    slug: "noor-haddad",
    name: "Noor Haddad",
    handle: "noorh",
    avatar: "NH",
    bio: "AI veterinary diagnostics. Saved $40M in unnecessary procedures at 3 chains.",
    location: "New York, NY",
    email: "noor@vetcheck.ai",
    links: [{ label: "vetcheck.ai", url: "https://vetcheck.ai" }],
    tags: ["AI", "Bio", "Healthcare"],
    verified: true,
    badges: ["NYC BioBuilders", "Sequoia Scout"],
    followers: 2104,
  },
  {
    slug: "rico-mendez",
    name: "Rico Mendez",
    handle: "ricom",
    avatar: "RM",
    bio: "Generative video infra. Powering 200+ AI film studios.",
    location: "Mexico City, MX",
    email: "rico@reelforge.io",
    links: [{ label: "reelforge.io", url: "https://reelforge.io" }],
    tags: ["AI", "Video", "Infra"],
    verified: true,
    badges: ["Cerebral Valley", "a16z Speedrun"],
    followers: 5980,
  },
  {
    slug: "priya-iyer",
    name: "Priya Iyer",
    handle: "priyai",
    avatar: "PI",
    bio: "Climate. Carbon accounting that doesn't lie. Ex-Stripe Climate.",
    location: "Bangalore, IN",
    email: "priya@carbonledger.earth",
    links: [{ label: "carbonledger.earth", url: "https://carbonledger.earth" }],
    tags: ["Climate", "Fintech"],
    badges: ["Lightspeed India", "Climate Demo Day"],
    followers: 421,
  },
  {
    slug: "miles-osei",
    name: "Miles Osei",
    handle: "milesosei",
    avatar: "MO",
    bio: "Voice agents for restaurants. 14k calls/day.",
    location: "Austin, TX",
    email: "miles@dialpie.com",
    links: [{ label: "dialpie.com", url: "https://dialpie.com" }],
    tags: ["AI", "Voice", "SMB"],
    verified: true,
    badges: ["Capital Factory", "YC W25"],
    followers: 1837,
  },
  {
    slug: "lena-park",
    name: "Lena Park",
    handle: "lenap",
    avatar: "LP",
    bio: "Code review agents that ship PRs while you sleep.",
    location: "Seoul, KR",
    email: "lena@sentry-agent.dev",
    links: [{ label: "sentry-agent.dev", url: "https://sentry-agent.dev" }],
    tags: ["Devtools", "Agents"],
    verified: true,
    badges: ["Seoul Builders", "Anthropic Builder Club"],
    followers: 4290,
  },
];

const YT = {
  rick: "dQw4w9WgXcQ",
  zoo: "jNQXAC9IVRw",
  gangnam: "9bZkp7q19f0",
  despacito: "kJQP7kiw5Fk",
} as const;

const pickYoutube = (i: number) => {
  const ids = [YT.rick, YT.zoo, YT.gangnam, YT.despacito];
  return ids[i % ids.length];
};

export const demos: Demo[] = [
  {
    id: "1",
    slug: "livesignal-realtime-call-copilot",
    title: "LiveSignal — the real-time copilot for sales calls",
    tagline: "It listens, scores objections, and feeds you the line before you blink.",
    description:
      "LiveSignal sits on your Zoom or Meet, transcribes in real time, and surfaces the next-best-thing-to-say based on your CRM history and the prospect's signals. Closed 12 deals on the demo call.",
    founderSlug: "amelia-okafor",
    youtubeId: pickYoutube(0),
    durationSec: 22,
    category: "AI",
    tags: ["AI", "Sales", "B2B"],
    upvotes: 487,
    views: 12_400,
    comments: 64,
    postedAt: "2026-05-26T18:12:00Z",
    source: "demo-day",
    sourceLabel: "SF AI Demo Day",
  },
  {
    id: "2",
    slug: "orbitlab-agent-runtime",
    title: "OrbitLab — a runtime for swarms of coding agents",
    tagline: "Spin up 200 agents in parallel, dedupe their work, ship one PR.",
    description:
      "Open-source orchestration layer for multi-agent coding. We solve the 'they all wrote the same util' problem with a shared scratchpad and convergent merging.",
    founderSlug: "vikram-shastri",
    youtubeId: pickYoutube(1),
    durationSec: 18,
    category: "Devtools",
    tags: ["Devtools", "Open Source", "Agents"],
    upvotes: 1_204,
    views: 38_200,
    comments: 142,
    postedAt: "2026-05-27T01:00:00Z",
    source: "founder",
  },
  {
    id: "3",
    slug: "kidlab-pip-the-tabletop-robot",
    title: "Pip — the tabletop robot that teaches kids to code",
    tagline: "Solder-free. Battery lasts a week. Ships in a Cheerios box.",
    description:
      "$79 robot kit, magnetic parts, no soldering. Kids program it from an iPad with block-based code that exports to Python.",
    founderSlug: "jules-tan",
    youtubeId: pickYoutube(2),
    durationSec: 28,
    category: "Hardware",
    tags: ["Hardware", "Robotics", "Education"],
    upvotes: 832,
    views: 21_600,
    comments: 88,
    postedAt: "2026-05-26T15:40:00Z",
    source: "hackathon",
    sourceLabel: "MIT AI Studio",
  },
  {
    id: "4",
    slug: "vetcheck-radiology-copilot",
    title: "VetCheck — radiology second-opinion in 4 seconds",
    tagline: "Vets upload an x-ray, get a confidence-scored differential.",
    description:
      "Trained on 4.2M annotated vet x-rays. Catches 31% more soft-tissue masses than the average vet on benchmark cases.",
    founderSlug: "noor-haddad",
    youtubeId: pickYoutube(3),
    durationSec: 26,
    category: "Bio",
    tags: ["AI", "Healthcare", "Bio"],
    upvotes: 612,
    views: 14_900,
    comments: 47,
    postedAt: "2026-05-25T22:18:00Z",
    source: "demo-day",
    sourceLabel: "NYC BioBuilders",
  },
  {
    id: "5",
    slug: "reelforge-frame-perfect-generation",
    title: "ReelForge — frame-perfect AI video at 60fps",
    tagline: "Most AI video is 24fps mush. We render at 60fps with motion blur control.",
    description:
      "Custom diffusion model trained on cinematic stock footage. API-first. $0.02/sec of output.",
    founderSlug: "rico-mendez",
    youtubeId: pickYoutube(0),
    durationSec: 19,
    category: "AI",
    tags: ["AI", "Video", "Infra"],
    upvotes: 2_341,
    views: 58_300,
    comments: 211,
    postedAt: "2026-05-27T03:22:00Z",
    source: "founder",
  },
  {
    id: "6",
    slug: "carbonledger-honest-accounting",
    title: "CarbonLedger — accounting that doesn't let you cheat",
    tagline: "Every offset is on-chain. Every emission is auditable.",
    description:
      "We tie purchases to verifiable retired offsets and publish the ledger. Used by 4 of the YC W26 climate batch.",
    founderSlug: "priya-iyer",
    youtubeId: pickYoutube(1),
    durationSec: 25,
    category: "Climate",
    tags: ["Climate", "Fintech"],
    upvotes: 394,
    views: 9_800,
    comments: 51,
    postedAt: "2026-05-26T11:05:00Z",
    source: "demo-day",
    sourceLabel: "Climate Demo Day Bangalore",
  },
  {
    id: "7",
    slug: "dialpie-voice-agents-for-restaurants",
    title: "DialPie — voice agents that take 14k restaurant calls a day",
    tagline: "Customer hangs up happy. Owner gets a CSV in the morning.",
    description:
      "Trained on 6M anonymized restaurant calls. Handles modifications, dietary questions, and waitlist in 4 languages.",
    founderSlug: "miles-osei",
    youtubeId: pickYoutube(2),
    durationSec: 21,
    category: "AI",
    tags: ["AI", "Voice", "SMB"],
    upvotes: 778,
    views: 18_700,
    comments: 92,
    postedAt: "2026-05-26T19:50:00Z",
    source: "founder",
  },
  {
    id: "8",
    slug: "sentry-agent-overnight-prs",
    title: "Sentry — code review agents that ship while you sleep",
    tagline: "Wake up to 12 merged PRs and a Slack summary.",
    description:
      "Pulls from your linear backlog, drafts the PR, runs your CI, and only pings you when it actually needs a human. Burned through 9k tasks in beta.",
    founderSlug: "lena-park",
    youtubeId: pickYoutube(3),
    durationSec: 23,
    category: "Devtools",
    tags: ["Devtools", "Agents"],
    upvotes: 1_812,
    views: 44_500,
    comments: 168,
    postedAt: "2026-05-27T05:40:00Z",
    source: "founder",
  },
  {
    id: "9",
    slug: "livesignal-objection-handling",
    title: "LiveSignal — what we learned from 10,000 sales objections",
    tagline: "60 second teardown of the patterns we found.",
    description: "Surprising finding: the top 3 objections account for 71% of lost deals.",
    founderSlug: "amelia-okafor",
    youtubeId: pickYoutube(0),
    durationSec: 17,
    category: "AI",
    tags: ["AI", "Sales"],
    upvotes: 240,
    views: 5_600,
    comments: 22,
    postedAt: "2026-05-24T14:00:00Z",
    source: "founder",
  },
  {
    id: "10",
    slug: "orbitlab-vs-traditional-orchestration",
    title: "OrbitLab vs. a one-shot Claude run",
    tagline: "Same task. Side by side. 4x faster, 1/3 the tokens.",
    description: "Refactoring a 12k LOC Rails app. Live benchmark.",
    founderSlug: "vikram-shastri",
    youtubeId: pickYoutube(1),
    durationSec: 24,
    category: "Devtools",
    tags: ["Devtools", "Agents"],
    upvotes: 920,
    views: 26_400,
    comments: 119,
    postedAt: "2026-05-25T08:15:00Z",
    source: "demo-day",
    sourceLabel: "Cerebral Valley AI",
  },
  {
    id: "11",
    slug: "ai-only-experimental-music-video",
    title: "AI-Generated: 'Neon Cathedral' — entirely synthetic music video",
    tagline: "No humans. No cameras. Made in 11 hours.",
    description:
      "Showcase of what's possible end-to-end with current generative tools. Tagged AI-only so you can filter it out — or filter to it.",
    founderSlug: "rico-mendez",
    youtubeId: pickYoutube(2),
    durationSec: 30,
    category: "AI",
    tags: ["AI", "Generative", "Showcase"],
    upvotes: 1_456,
    views: 92_100,
    comments: 287,
    postedAt: "2026-05-23T20:00:00Z",
    source: "ai-generated",
  },
  {
    id: "12",
    slug: "kidlab-cereal-box-unboxing",
    title: "Pip arrives in a literal Cheerios box. Unboxing.",
    tagline: "Lower-cost shipping. Higher-delight unboxing.",
    description:
      "Our supply chain hack: Cheerios boxes are dirt cheap, shockproof, and fit a Pip kit perfectly.",
    founderSlug: "jules-tan",
    youtubeId: pickYoutube(3),
    durationSec: 16,
    category: "Hardware",
    tags: ["Hardware", "Supply Chain"],
    upvotes: 502,
    views: 11_900,
    comments: 41,
    postedAt: "2026-05-22T12:00:00Z",
    source: "founder",
  },
];

export const demoDays: DemoDay[] = [
  {
    id: "dd-1",
    slug: "sf-ai-demo-day-jun",
    name: "SF AI Demo Day — June",
    host: "Frontier Tower",
    date: "2026-06-12T18:00:00-07:00",
    city: "San Francisco, CA",
    venue: "Frontier Tower, 27F",
    format: "in-person",
    blurb: "30 startups. 2-minute demos. No slides allowed. Demo Hunt records every pitch.",
    registerUrl: "#",
    capturedBy: "demohunt",
    demoCount: 30,
  },
  {
    id: "dd-2",
    slug: "yc-w26-demo-day",
    name: "YC W26 Demo Day",
    host: "Y Combinator",
    date: "2026-06-04T09:00:00-07:00",
    city: "Mountain View, CA",
    venue: "Online + invite-only",
    format: "hybrid",
    blurb: "We're capturing public demos with permission and indexing them here within 24h.",
    registerUrl: "#",
    capturedBy: "host",
    demoCount: 240,
  },
  {
    id: "dd-3",
    slug: "claws-out-hack-finals",
    name: "Claws Out — Hackathon Finals",
    host: "Anthropic Builder Club",
    date: "2026-06-22T17:00:00-04:00",
    city: "New York, NY",
    venue: "Brooklyn Steel",
    format: "in-person",
    blurb: "Top 12 Claude-built projects pitch live. Demo Hunt videographers on-site.",
    registerUrl: "#",
    capturedBy: "demohunt",
    demoCount: 12,
  },
  {
    id: "dd-4",
    slug: "mit-ai-studio-spring",
    name: "MIT AI Studio Spring Showcase",
    host: "MIT Media Lab",
    date: "2026-05-30T14:00:00-04:00",
    city: "Cambridge, MA",
    venue: "Media Lab E15",
    format: "hybrid",
    blurb: "All 41 projects from the spring AI Studio batch.",
    registerUrl: "#",
    capturedBy: "demohunt",
    demoCount: 41,
  },
  {
    id: "dd-5",
    slug: "climate-demo-day-blr",
    name: "Climate Demo Day — Bangalore",
    host: "Lightspeed India",
    date: "2026-06-08T19:00:00+05:30",
    city: "Bangalore, IN",
    venue: "Online",
    format: "online",
    blurb: "Climate tech founders from across South Asia. 90 second pitches.",
    registerUrl: "#",
    capturedBy: "host",
    demoCount: 18,
  },
  {
    id: "dd-6",
    slug: "agent-force-jun",
    name: "AgentForce Live",
    host: "Salesforce",
    date: "2026-06-18T10:00:00-07:00",
    city: "San Francisco, CA",
    venue: "Salesforce Tower",
    format: "hybrid",
    blurb: "Public demos from the AgentForce team plus 8 partner startups.",
    registerUrl: "#",
    capturedBy: "host",
    demoCount: 11,
  },
];

export type SearchResults = {
  query: string;
  demos: Demo[];
  founders: Founder[];
  total: number;
};

export function search(q: string): SearchResults {
  const query = q.trim();
  if (!query) return { query, demos: [], founders: [], total: 0 };
  const needle = query.toLowerCase();
  const matchedFounders = founders.filter(
    (f) =>
      f.name.toLowerCase().includes(needle) ||
      f.handle.toLowerCase().includes(needle) ||
      f.bio.toLowerCase().includes(needle) ||
      f.tags.some((t) => t.toLowerCase().includes(needle)) ||
      f.badges?.some((b) => b.toLowerCase().includes(needle)),
  );
  const matchedFounderSlugs = new Set(matchedFounders.map((f) => f.slug));
  const matchedDemos = demos.filter(
    (d) =>
      d.title.toLowerCase().includes(needle) ||
      d.tagline.toLowerCase().includes(needle) ||
      d.description.toLowerCase().includes(needle) ||
      d.tags.some((t) => t.toLowerCase().includes(needle)) ||
      d.category.toLowerCase().includes(needle) ||
      d.sourceLabel?.toLowerCase().includes(needle) ||
      matchedFounderSlugs.has(d.founderSlug),
  );
  return {
    query,
    demos: matchedDemos,
    founders: matchedFounders,
    total: matchedDemos.length + matchedFounders.length,
  };
}

export const founderBySlug = (slug: string) =>
  founders.find((f) => f.slug === slug);

export const demoById = (id: string) => demos.find((d) => d.id === id);

export const demoBySlug = (slug: string) => demos.find((d) => d.slug === slug);

export const demosByFounder = (slug: string) =>
  demos.filter((d) => d.founderSlug === slug);

export function getDemosForTab(tab: string): Demo[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const sortByUpvotes = (a: Demo, b: Demo) => b.upvotes - a.upvotes;
  switch (tab) {
    case "today":
      return [...demos]
        .filter((d) => now - new Date(d.postedAt).getTime() < dayMs * 1.5)
        .sort(sortByUpvotes);
    case "week":
      return [...demos]
        .filter((d) => now - new Date(d.postedAt).getTime() < dayMs * 7)
        .sort(sortByUpvotes);
    case "rising":
      return [...demos].sort((a, b) => {
        const ageA = (now - new Date(a.postedAt).getTime()) / dayMs;
        const ageB = (now - new Date(b.postedAt).getTime()) / dayMs;
        return b.upvotes / (1 + ageB) - a.upvotes / (1 + ageA);
      });
    case "ai":
      return [...demos].filter((d) => d.tags.includes("AI") || d.source === "ai-generated");
    case "for-you":
    default:
      return [...demos].sort((a, b) => {
        const ageA = (now - new Date(a.postedAt).getTime()) / dayMs;
        const ageB = (now - new Date(b.postedAt).getTime()) / dayMs;
        const scoreA = a.upvotes * 0.7 + a.views * 0.0005 - ageA * 30;
        const scoreB = b.upvotes * 0.7 + b.views * 0.0005 - ageB * 30;
        return scoreB - scoreA;
      });
  }
}
