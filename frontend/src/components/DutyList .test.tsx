import React from 'react'
import { render, screen } from '@testing-library/react'
import { DutyList } from './DutyList'
import type { Duty } from '../types/duty'

const duties: Duty[] = [
  { id: '1', name: 'Buy milk', created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z' },
  { id: '2', name: 'Walk the dog', created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z' },
]

describe('DutyList', () => {
  test('shows empty message when there are no duties', () => {
    render(<DutyList duties={[]} onUpdate={jest.fn()} onDelete={jest.fn()} />)

    expect(screen.getByText(/no duties yet/i)).toBeInTheDocument()
  })

  test('renders one item per duty', () => {
    render(<DutyList duties={duties} onUpdate={jest.fn()} onDelete={jest.fn()} />)

    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText('Walk the dog')).toBeInTheDocument()
  })

  test('disables buttons when disabled prop is true', () => {
    render(<DutyList duties={duties} disabled onUpdate={jest.fn()} onDelete={jest.fn()} />)

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })

    editButtons.forEach((btn) => expect(btn).toBeDisabled())
    deleteButtons.forEach((btn) => expect(btn).toBeDisabled())
  })
})