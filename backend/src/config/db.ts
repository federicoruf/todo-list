import { Pool } from "pg";
import { logger } from "./logger";

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (_pool) return _pool;

  const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    max: process.env.PGPOOL_MAX ? Number(process.env.PGPOOL_MAX) : 10,
    idleTimeoutMillis: process.env.PG_IDLE_TIMEOUT_MS
      ? Number(process.env.PG_IDLE_TIMEOUT_MS)
      : 10_000,
    connectionTimeoutMillis: process.env.PG_CONN_TIMEOUT_MS
      ? Number(process.env.PG_CONN_TIMEOUT_MS)
      : 5_000,
  });

  pool.on("error", (err: Error) => {
    logger.error("pg pool error", { err });
  });

  _pool = pool;
  return pool;
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[] }> {
  const pool = getPool();
  const startedAt = Date.now();
  try {
    const result = await pool.query(text, params as never);
    logger.debug("db query", { ms: Date.now() - startedAt, text });
    return { rows: result.rows as T[] };
  } catch (err) {
    logger.error("db query failed", { ms: Date.now() - startedAt, text, err });
    throw err;
  }
}

