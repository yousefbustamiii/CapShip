-- Migration: 0001_init
-- CapShip initial schema

-- Tracks every Polar-generated pro license key
CREATE TABLE IF NOT EXISTS licenses (
  id           TEXT PRIMARY KEY,                          -- UUID v4, generated server-side
  key          TEXT UNIQUE  NOT NULL,                     -- Polar license key string (e.g. "CAPS-XXXX-XXXX-XXXX")
  polar_id     TEXT UNIQUE  NOT NULL,                     -- Polar internal license_key_id
  polar_order  TEXT                          ,            -- Polar order_id for reference
  customer_email TEXT                        ,            -- buyer email for support
  status       TEXT NOT NULL DEFAULT 'active',            -- active | used | revoked
  activated_at TEXT                          ,            -- ISO 8601 UTC timestamp, NULL until redeemed
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))    -- ISO 8601 UTC timestamp
);

-- Index for fast single-key lookups (the hot path on every CLI redeem call)
CREATE UNIQUE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);

-- Audit trail: every redemption attempt, success or failure
CREATE TABLE IF NOT EXISTS redemption_logs (
  id           TEXT PRIMARY KEY,
  license_key  TEXT NOT NULL,
  success      INTEGER NOT NULL,   -- 1 = redeemed OK, 0 = rejected
  reason       TEXT    ,           -- NULL on success, error reason on failure
  ip           TEXT    ,           -- requester IP for abuse tracking
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_redemption_logs_key ON redemption_logs(license_key);
