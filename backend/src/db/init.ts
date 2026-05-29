import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import dotenv from "dotenv";
import { getPool } from "../config/db";
import { logger } from "../config/logger";

dotenv.config();

async function main() {
  const schemaPath = resolve(__dirname, "schema.sql");
  const sql = await readFile(schemaPath, "utf8");

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    logger.info("db initialized", { schemaPath });
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("db init failed", { err });
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

void main();

