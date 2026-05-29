import type { Request, Response } from "express";
import * as service from "../services/duty.service";

export async function listDuties(_req: Request, res: Response) {
  const duties = await service.listDuties();
  return res.json({ duties });
}

export async function createDuty(req: Request, res: Response) {
  const duty = await service.createDuty({ name: String(req.body?.name ?? "") });
  return res.status(201).json({ duty });
}

export async function updateDuty(req: Request, res: Response) {
  const id = String(req.params.id ?? "");
  const duty = await service.updateDuty(id, { name: String(req.body?.name ?? "") });
  return res.json({ duty });
}

export async function deleteDuty(req: Request, res: Response) {
  const id = String(req.params.id ?? "");
  await service.deleteDuty(id);
  return res.status(204).send();
}

