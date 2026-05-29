import type { Duty } from "../models/duty.interface";
import { query } from "../config/db";

export async function listDuties(): Promise<Duty[]> {
  const result = await query<Duty>(
    `SELECT id, name, created_at, updated_at
     FROM duties
     ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getDutyById(id: string): Promise<Duty | null> {
  const result = await query<Duty>(
    `SELECT id, name, created_at, updated_at
     FROM duties
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function createDuty(name: string): Promise<Duty> {
  const result = await query<Duty>(
    `INSERT INTO duties (name)
     VALUES ($1)
     RETURNING id, name, created_at, updated_at`,
    [name]
  );
  return result.rows[0] as Duty;
}

export async function updateDuty(id: string, name: string): Promise<Duty | null> {
  const result = await query<Duty>(
    `UPDATE duties
     SET name = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, name, created_at, updated_at`,
    [id, name]
  );
  return result.rows[0] ?? null;
}

export async function deleteDuty(id: string): Promise<boolean> {
  const result = await query<{ id: string }>(
    `DELETE FROM duties
     WHERE id = $1
     RETURNING id`,
    [id]
  );
  return Boolean(result.rows[0]?.id);
}

