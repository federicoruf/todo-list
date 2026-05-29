import type { Duty } from '../types/duty'
import { DutyItem } from './DutyItem'

type Props = {
  duties: Duty[]
  disabled?: boolean
  onUpdate: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function DutyList({ duties, disabled, onUpdate, onDelete }: Props) {
  if (duties.length === 0) {
    return <p className="empty">No duties yet. Add one above.</p>
  }

  return (
    <ul className="duty-list">
      {duties.map((duty) => (
        <DutyItem
          key={duty.id}
          duty={duty}
          disabled={disabled}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
