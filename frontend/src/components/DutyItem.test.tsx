import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DutyItem } from './DutyItem'
import type { Duty } from '../types/duty'

const duty: Duty = { id: '1', name: 'Buy milk', created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z' }

describe('DutyItem', () => {
  test('renders the name and buttons Edit and Delete', () => {
    render(<DutyItem duty={duty} onUpdate={jest.fn()} onDelete={jest.fn()} />)

    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  test('when clicking Edit shows the form with the current value', async () => {
    const user = userEvent.setup()
    render(<DutyItem duty={duty} onUpdate={jest.fn()} onDelete={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))

    expect(screen.getByLabelText(/edit duty name/i)).toHaveValue('Buy milk')
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  test('when clicking Cancel returns to normal with the original name', async () => {
    const user = userEvent.setup()
    render(<DutyItem duty={duty} onUpdate={jest.fn()} onDelete={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByLabelText(/edit duty name/i))
    await user.type(screen.getByLabelText(/edit duty name/i), 'Other name')
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.queryByLabelText(/edit duty name/i)).not.toBeInTheDocument()
  })

  test('does not call onUpdate if the name did not change', async () => {
    const user = userEvent.setup()
    const onUpdate = jest.fn().mockResolvedValue(undefined)
    render(<DutyItem duty={duty} onUpdate={onUpdate} onDelete={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onUpdate).not.toHaveBeenCalled()
  })

  test('does not call onUpdate if the name is empty', async () => {
    const user = userEvent.setup()
    const onUpdate = jest.fn().mockResolvedValue(undefined)
    render(<DutyItem duty={duty} onUpdate={onUpdate} onDelete={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByLabelText(/edit duty name/i))

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  test('calls onUpdate with the trimmed name and returns to normal', async () => {
    const user = userEvent.setup()
    const onUpdate = jest.fn().mockResolvedValue(undefined)
    render(<DutyItem duty={duty} onUpdate={onUpdate} onDelete={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.clear(screen.getByLabelText(/edit duty name/i))
    await user.type(screen.getByLabelText(/edit duty name/i), '  Buy bread  ')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('1', 'Buy bread')
      expect(screen.queryByLabelText(/edit duty name/i)).not.toBeInTheDocument()
    })
  })

  test('calls onDelete with the id', async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn().mockResolvedValue(undefined)
    render(<DutyItem duty={duty} onUpdate={jest.fn()} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('1')
    })
  })

  test('disables the Edit and Delete buttons when disabled', () => {
    render(<DutyItem duty={duty} disabled onUpdate={jest.fn()} onDelete={jest.fn()} />)

    expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled()
  })
})