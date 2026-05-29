export type Duty = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export type ApiErrorBody = {
  error: {
    message: string
    code: string
  }
}
