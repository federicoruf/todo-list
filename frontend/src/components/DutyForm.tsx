import { useState } from 'react'

type Props = {
  onSubmit: (name: string) => Promise<void>
  disabled?: boolean
}

export function DutyForm({ onSubmit, disabled }: Props) {
  const [name, setName] = useState('')

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await onSubmit(trimmed)
    setName('')
  }

  return (
    <form className="duty-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New duty…"
        maxLength={255}
        disabled={disabled}
        aria-label="Duty name"
      />
      <button type="submit" disabled={disabled || !name.trim()}>
        Add
      </button>
    </form>
  )
}
