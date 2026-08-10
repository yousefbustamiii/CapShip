import { execute, queryOne } from "@/infrastructure/db/client";

export async function claimWebhookEvent(
  db: D1Database,
  grantId: string,
): Promise<boolean> {
  const result = await execute(
    db,
    `INSERT OR IGNORE INTO webhook_events (grant_id) VALUES (?)`,
    grantId,
  );
  return (result.meta.rows_written ?? 0) > 0;
}

export async function isWebhookEventProcessed(
  db: D1Database,
  grantId: string,
): Promise<boolean> {
  const row = await queryOne<{ grant_id: string }>(
    db,
    `SELECT grant_id FROM webhook_events WHERE grant_id = ?`,
    grantId,
  );
  return row !== null;
}
