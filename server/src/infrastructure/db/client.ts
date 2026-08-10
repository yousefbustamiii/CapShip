import type { Env } from "@/env";

type D1ParameterValue = string | number | null | ArrayBuffer;

export function getDb(env: Env): D1Database {
  return env.DB;
}

export async function queryAll<T>(
  db: D1Database,
  sql: string,
  ...bindings: D1ParameterValue[]
): Promise<T[]> {
  const stmt = db.prepare(sql);
  const bound = bindings.length > 0 ? stmt.bind(...bindings) : stmt;
  const result = await bound.all<T>();
  return result.results;
}

export async function queryOne<T>(
  db: D1Database,
  sql: string,
  ...bindings: D1ParameterValue[]
): Promise<T | null> {
  const stmt = db.prepare(sql);
  const bound = bindings.length > 0 ? stmt.bind(...bindings) : stmt;
  return bound.first<T>();
}

export async function execute(
  db: D1Database,
  sql: string,
  ...bindings: D1ParameterValue[]
): Promise<D1Result> {
  const stmt = db.prepare(sql);
  const bound = bindings.length > 0 ? stmt.bind(...bindings) : stmt;
  return bound.run();
}

export async function executeBatch(
  db: D1Database,
  statements: D1PreparedStatement[],
): Promise<D1Result[]> {
  return db.batch(statements);
}
