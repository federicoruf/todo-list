import type { Duty } from "../models/duty.interface";
import * as repo from "../repositories/duty.repository";
import { HttpError } from "../middleware/error.middleware";

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function assertName(name: string) {
  const normalized = normalizeName(name);
  if (!normalized) throw new HttpError(400, "VALIDATION_ERROR", "Name is required");
  if (normalized.length > 255) {
    throw new HttpError(400, "VALIDATION_ERROR", "Name is too long");
  }
  return normalized;
}

export async function listDuties(): Promise<Duty[]> {
  return repo.listDuties();
}

export async function createDuty(input: { name: string }): Promise<Duty> {
  const name = assertName(input.name);
  return repo.createDuty(name);
}

export async function updateDuty(
  id: string,
  input: { name: string }
): Promise<Duty> {
  const name = assertName(input.name);
  const updated = await repo.updateDuty(id, name);
  if (!updated) throw new HttpError(404, "NOT_FOUND", "Duty not found");
  return updated;
}

export async function deleteDuty(id: string): Promise<void> {
  const ok = await repo.deleteDuty(id);
  if (!ok) throw new HttpError(404, "NOT_FOUND", "Duty not found");
}

