import type { ApiErrorBody } from '../types/duty'

export async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as ApiErrorBody
    if (data.error?.message) return data.error.message
  } catch {
    /* not JSON */
  }
  return res.statusText || 'Request failed'
}

export async function assertOk(res: Response): Promise<void> {
  if (!res.ok) throw new Error(await readErrorMessage(res))
}
