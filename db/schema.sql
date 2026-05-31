-- demohunt v2 auth + persistence schema
-- Safe to run against an empty Neon/Vercel Postgres database.
-- All tables are created IF NOT EXISTS so this file is idempotent.

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  vercel_id   TEXT UNIQUE NOT NULL,
  name        TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS upvotes (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  demo_id     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, demo_id)
);

CREATE TABLE IF NOT EXISTS follows (
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  founder_slug TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, founder_slug)
);

CREATE TABLE IF NOT EXISTS digest_opt_in (
  user_id     TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful secondary indexes for the common read paths.
CREATE INDEX IF NOT EXISTS upvotes_demo_id_idx ON upvotes (demo_id);
CREATE INDEX IF NOT EXISTS follows_founder_slug_idx ON follows (founder_slug);
