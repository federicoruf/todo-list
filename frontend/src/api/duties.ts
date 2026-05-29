import { API_BASE } from './config'
import { assertOk } from './http'
import type { Duty } from '../types/duty'

export async function listDuties(): Promise<Duty[]> {
  const res = await fetch(`${API_BASE}/duties`)
  await assertOk(res)
  const data = (await res.json()) as { duties: Duty[] }
  return data.duties
}

export async function createDuty(name: string): Promise<Duty> {
  const res = await fetch(`${API_BASE}/duties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  await assertOk(res)
  const data = (await res.json()) as { duty: Duty }
  return data.duty
}

export async function updateDuty(id: string, name: string): Promise<Duty> {
  const res = await fetch(`${API_BASE}/duties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  await assertOk(res)
  const data = (await res.json()) as { duty: Duty }
  return data.duty
}

export async function deleteDuty(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/duties/${id}`, { method: 'DELETE' })
  await assertOk(res)
}
