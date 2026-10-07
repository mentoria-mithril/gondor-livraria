'use client'

import { useEffect, useState } from 'react'
import { getApiHealth, type ApiHealthStatus } from '@/services/api'

type StatusState =
  | { phase: 'loading' }
  | { phase: 'ok'; health: ApiHealthStatus }
  | { phase: 'error'; message: string }

/**
 * Shows whether the app services are running. It also demonstrates the three
 * states every API-backed screen should handle: loading, error, and success.
 */
export function ApiStatus() {
  const [state, setState] = useState<StatusState>({ phase: 'loading' })

  useEffect(() => {
    let isMounted = true

    getApiHealth()
      .then((health) => isMounted && setState({ phase: 'ok', health }))
      .catch((error: Error) => isMounted && setState({ phase: 'error', message: error.message }))

    // Avoid calling setState after the component unmounts.
    return () => {
      isMounted = false
    }
  }, [])

  if (state.phase === 'loading') {
    return <p className="text-sm text-zinc-500">Connecting to the API…</p>
  }

  if (state.phase === 'error') {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
        <p className="font-medium text-red-700 dark:text-red-300">API is unavailable</p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.message}</p>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          Start the API with <code className="font-mono">npm run dev</code> inside{' '}
          <code className="font-mono">api/</code>.
        </p>
      </div>
    )
  }

  const databaseIsAvailable = state.health.database === 'connected'
  const panelClassName = databaseIsAvailable
    ? 'rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/40'
    : 'rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40'
  const statusClassName = databaseIsAvailable
    ? 'font-medium text-green-700 dark:text-green-300'
    : 'font-medium text-amber-700 dark:text-amber-300'

  return (
    <div className={panelClassName}>
      <p className={statusClassName}>
        {databaseIsAvailable ? 'API online · database online' : 'API online · database unavailable'}
      </p>
      {!databaseIsAvailable && (
        <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
          Start PostgreSQL with <code className="font-mono">docker compose up -d</code> from the project root.
        </p>
      )}
    </div>
  )
}
