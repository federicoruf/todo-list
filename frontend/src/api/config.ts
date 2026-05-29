const meta = import.meta as { env?: { VITE_API_URL?: string } };

export const API_BASE =
  meta.env?.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';