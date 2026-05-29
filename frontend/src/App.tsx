import { useEffect, useState } from 'react'
import * as dutiesApi from './api/duties'
import { API_BASE } from './api/config'
import { DutyForm } from './components/DutyForm'
import { DutyList } from './components/DutyList'
import type { Duty } from './types/duty'
import './App.css'

function App() {
  const [duties, setDuties] = useState<Duty[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  

  useEffect(() => {
    const initialLoad = async () => {
      setError(null)
      setLoading(true)
      try {
        const list = await dutiesApi.listDuties()
        setDuties(list)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load duties')
      } finally {
        setLoading(false)
      }
    };
    void initialLoad()
  }, [])

  async function withBusy<T>(fn: () => Promise<T>): Promise<T> {
    setBusy(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      throw err
    } finally {
      setBusy(false)
    }
  }

  async function handleCreate(name: string) {
    const duty = await withBusy(() => dutiesApi.createDuty(name))
    setDuties((prev) => [duty, ...prev])
  }

  async function handleUpdate(id: string, name: string) {
    const duty = await withBusy(() => dutiesApi.updateDuty(id, name))
    setDuties((prev) => prev.map((d) => (d.id === id ? duty : d)))
  }

  async function handleDelete(id: string) {
    await withBusy(() => dutiesApi.deleteDuty(id))
    setDuties((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Duties</h1>
        <p className="api-hint">
          API: <code>{API_BASE}</code>
        </p>
      </header>

      {error && (
        <div className="banner banner--error" role="alert">
          {error}
          <button type="button" className="btn-ghost" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      <DutyForm onSubmit={handleCreate} disabled={busy || loading} />

      {loading ? (
        <p className="status">Loading…</p>
      ) : (
        <DutyList
          duties={duties}
          disabled={busy}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App
