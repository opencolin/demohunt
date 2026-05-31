/**
 * Typed Postgres wrapper for demohunt v2.
 *
 * Everything in here is *env-gated*: if `process.env.DATABASE_URL` is missing
 * (local dev, preview without a DB linked, CI build, etc.) every helper becomes
 * a safe no-op that returns `false` / does nothing. There is NEVER a runtime
 * throw when the DB is absent, so the client can transparently fall back to
 * localStorage.
 *
 * The Postgres driver is imported lazily and behind a dynamically-built module
 * specifier so the bundler does not try to resolve it at build time. That means
 * `next build` succeeds even with no database (and even if the driver weren't
 * installed). A query is only ever attempted when DATABASE_URL is set.
 */

export type DbUser = {
  id: string;
  vercel_id: string;
  name: string | null;
  email: string | null;
  created_at: string;
};

// Minimal shape of the thing we need from a pg-compatible driver. Both
// `@vercel/postgres` (createPool) and `@neondatabase/serverless` (Pool) expose
// a `query(text, params)` call returning `{ rows }`. We normalise onto a single
// `query(text, params) => { rows }` function.
type QueryFn = (text: string, params?: unknown[]) => Promise<{ rows: unknown[] }>;

let queryFnPromise: Promise<QueryFn | null> | null = null;

export function isDbEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Import an *optional* dependency at runtime without letting the bundler
 * statically resolve it. The specifier is reassembled from a variable so
 * Turbopack/webpack cannot trace it, which keeps the build green whether or not
 * the driver is present. Any failure resolves to `null`.
 */
async function loadOptional(pkg: string): Promise<unknown | null> {
  const specifier = String(pkg);
  try {
    return (await import(/* webpackIgnore: true */ specifier)) as unknown;
  } catch {
    return null;
  }
}

/**
 * Resolve a query function from whichever driver is installed. Memoised so we
 * only construct the pool once per server runtime. Returns `null` if the DB is
 * disabled or no compatible driver can be loaded — callers treat `null` as
 * "not persisted".
 */
async function getQueryFn(): Promise<QueryFn | null> {
  if (!isDbEnabled()) return null;
  if (queryFnPromise) return queryFnPromise;

  queryFnPromise = (async () => {
    const connectionString = process.env.DATABASE_URL!;

    // Prefer @vercel/postgres if present.
    const vercelMod = await loadOptional("@vercel/postgres");
    const createPool = (
      vercelMod as { createPool?: (cfg: { connectionString: string }) => unknown } | null
    )?.createPool;
    if (typeof createPool === "function") {
      try {
        const pool = createPool({ connectionString }) as { query: QueryFn };
        return (text: string, params?: unknown[]) => pool.query(text, params);
      } catch {
        // fall through to the next driver
      }
    }

    // Fall back to @neondatabase/serverless.
    const neonMod = await loadOptional("@neondatabase/serverless");
    const Pool = (
      neonMod as { Pool?: new (cfg: { connectionString: string }) => unknown } | null
    )?.Pool;
    if (typeof Pool === "function") {
      try {
        const pool = new Pool({ connectionString }) as { query: QueryFn };
        return (text: string, params?: unknown[]) => pool.query(text, params);
      } catch {
        // fall through
      }
    }

    return null;
  })();

  return queryFnPromise;
}

/** Run a query, swallowing all errors into `null`. Never throws. */
async function safeQuery(
  text: string,
  params: unknown[] = [],
): Promise<unknown[] | null> {
  const query = await getQueryFn();
  if (!query) return null;
  try {
    const result = await query(text, params);
    return result?.rows ?? [];
  } catch (err) {
    console.error("[db] query failed (falling back):", err);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Upvotes                                                                    */
/* -------------------------------------------------------------------------- */

export async function getUpvote(userId: string, demoId: string): Promise<boolean> {
  const rows = await safeQuery(
    "SELECT 1 FROM upvotes WHERE user_id = $1 AND demo_id = $2 LIMIT 1",
    [userId, demoId],
  );
  return Array.isArray(rows) && rows.length > 0;
}

export async function addUpvote(userId: string, demoId: string): Promise<boolean> {
  const rows = await safeQuery(
    `INSERT INTO upvotes (user_id, demo_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, demo_id) DO NOTHING`,
    [userId, demoId],
  );
  return rows !== null;
}

export async function removeUpvote(userId: string, demoId: string): Promise<boolean> {
  const rows = await safeQuery(
    "DELETE FROM upvotes WHERE user_id = $1 AND demo_id = $2",
    [userId, demoId],
  );
  return rows !== null;
}

/* -------------------------------------------------------------------------- */
/* Follows                                                                    */
/* -------------------------------------------------------------------------- */

export async function getFollow(userId: string, founderSlug: string): Promise<boolean> {
  const rows = await safeQuery(
    "SELECT 1 FROM follows WHERE user_id = $1 AND founder_slug = $2 LIMIT 1",
    [userId, founderSlug],
  );
  return Array.isArray(rows) && rows.length > 0;
}

export async function addFollow(userId: string, founderSlug: string): Promise<boolean> {
  const rows = await safeQuery(
    `INSERT INTO follows (user_id, founder_slug)
     VALUES ($1, $2)
     ON CONFLICT (user_id, founder_slug) DO NOTHING`,
    [userId, founderSlug],
  );
  return rows !== null;
}

export async function removeFollow(userId: string, founderSlug: string): Promise<boolean> {
  const rows = await safeQuery(
    "DELETE FROM follows WHERE user_id = $1 AND founder_slug = $2",
    [userId, founderSlug],
  );
  return rows !== null;
}

/* -------------------------------------------------------------------------- */
/* Users (used by the OAuth callback)                                         */
/* -------------------------------------------------------------------------- */

/**
 * Upsert a user by their Vercel id and return the local user id. Returns `null`
 * if the DB is disabled/unavailable so the caller can still mint a session
 * cookie keyed on the Vercel id directly.
 */
export async function upsertUser(input: {
  vercelId: string;
  name?: string | null;
  email?: string | null;
}): Promise<string | null> {
  const id = `u_${input.vercelId}`;
  const rows = await safeQuery(
    `INSERT INTO users (id, vercel_id, name, email)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (vercel_id)
       DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email
     RETURNING id`,
    [id, input.vercelId, input.name ?? null, input.email ?? null],
  );
  if (rows === null) return null;
  const first = rows[0] as { id?: string } | undefined;
  return first?.id ?? id;
}
