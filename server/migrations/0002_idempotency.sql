CREATE TABLE IF NOT EXISTS webhook_events (
  grant_id     TEXT PRIMARY KEY,
  processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_licenses_polar_id ON licenses(polar_id);
