import { useState } from 'react'
import type { Duty } from '../types/duty'

type Props = {
  duty: Duty
  disabled?: boolean
  onUpdate: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function DutyItem({ duty, disabled, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(duty.name)
  const [busy, setBusy] = useState(false)

  async function handleSave(event: React.SubmitEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed === duty.name) {
      setEditing(false)
      setName(duty.name)
      return
    }
    setBusy(true)
    try {
      await onUpdate(duty.id, trimmed)
      setEditing(false)
    } finally {
      setBusy(false)
    }
  }

  function handleCancel() {
    setName(duty.name)
    setEditing(false)
  }

  async function handleDelete() {
    setBusy(true)
    try {
      await onDelete(duty.id)
    } finally {
      setBusy(false)
    }
  }

  const isDisabled = disabled || busy

  if (editing) {
    return (
      <li className="duty-item duty-item--editing">
        <form className="duty-item__edit" onSubmit={handleSave}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={255}
            disabled={isDisabled}
            autoFocus
            aria-label="Edit duty name"
          />
          <div className="duty-item__actions">
            <button type="submit" disabled={isDisabled || !name.trim()}>
              Save
            </button>
            <button type="button" className="btn-ghost" onClick={handleCancel} disabled={isDisabled}>
              Cancel
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="duty-item">
      <span className="duty-item__name">{duty.name}</span>
      <div className="duty-item__actions">
        <button type="button" className="btn-ghost" onClick={() => setEditing(true)} disabled={isDisabled}>
          Edit
        </button>
        <button type="button" className="btn-danger" onClick={handleDelete} disabled={isDisabled}>
          Delete
        </button>
      </div>
    </li>
  )
}
