import { execute, executeBatch, queryOne } from "@/infrastructure/db/client";

import type { CreateLicensePayload, License, RedemptionLogPayload } from "./licenses.types";

export async function findLicenseByKey(
  db: D1Database,
  key: string,
): Promise<License | null> {
  return queryOne<License>(
    db,
    `SELECT id, key, polar_id, polar_order, customer_email, status, activated_at, created_at
     FROM licenses
     WHERE key = ?`,
    key,
  );
}

export async function findLicenseByPolarId(
  db: D1Database,
  polarId: string,
): Promise<License | null> {
  return queryOne<License>(
    db,
    `SELECT id, key, polar_id, polar_order, customer_email, status, activated_at, created_at
     FROM licenses
     WHERE polar_id = ?`,
    polarId,
  );
}

export async function insertLicense(
  db: D1Database,
  payload: CreateLicensePayload,
): Promise<void> {
  await execute(
    db,
    `INSERT INTO licenses (id, key, polar_id, polar_order, customer_email, status)
     VALUES (?, ?, ?, ?, ?, 'active')`,
    payload.id,
    payload.key,
    payload.polar_id,
    payload.polar_order,
    payload.customer_email,
  );
}

export async function redeemLicense(
  db: D1Database,
  key: string,
  activatedAt: string,
  log: RedemptionLogPayload,
): Promise<boolean> {
  const updateStmt = db
    .prepare(
      `UPDATE licenses
       SET status = 'used', activated_at = ?
       WHERE key = ? AND status = 'active'`,
    )
    .bind(activatedAt, key);

  const logStmt = db
    .prepare(
      `INSERT INTO redemption_logs (id, license_key, success, reason, ip)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(log.id, log.license_key, log.success, log.reason, log.ip);

  const [updateResult] = await executeBatch(db, [updateStmt, logStmt]);
  return (updateResult?.meta.rows_written ?? 0) > 0;
}

export async function revokeLicense(db: D1Database, key: string): Promise<void> {
  await execute(db, `UPDATE licenses SET status = 'revoked' WHERE key = ?`, key);
}

export async function logFailedRedemption(
  db: D1Database,
  log: RedemptionLogPayload,
): Promise<void> {
  await execute(
    db,
    `INSERT INTO redemption_logs (id, license_key, success, reason, ip)
     VALUES (?, ?, 0, ?, ?)`,
    log.id,
    log.license_key,
    log.reason,
    log.ip,
  );
}
