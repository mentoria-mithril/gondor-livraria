'use client'

import { useEffect, useState } from 'react'
import { obterSaude, type Saude } from '@/servicos/api'

type Estado =
  | { fase: 'carregando' }
  | { fase: 'ok'; saude: Saude }
  | { fase: 'erro'; mensagem: string }

/**
 * O "está tudo ligado?" da fatia 0. É também o exemplo mínimo de um componente
 * que consome a API: estado de carregando, estado de erro e estado de sucesso —
 * os três, sempre. Tela que só trata o caminho feliz volta no review.
 */
export function StatusDaApi() {
  const [estado, setEstado] = useState<Estado>({ fase: 'carregando' })

  useEffect(() => {
    let vivo = true

    obterSaude()
      .then((saude) => vivo && setEstado({ fase: 'ok', saude }))
      .catch((erro: Error) => vivo && setEstado({ fase: 'erro', mensagem: erro.message }))

    // Evita `setState` depois do componente sair da tela.
    return () => {
      vivo = false
    }
  }, [])

  if (estado.fase === 'carregando') {
    return <p className="text-sm text-zinc-500">Falando com a API…</p>
  }

  if (estado.fase === 'erro') {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
        <p className="font-medium text-red-700 dark:text-red-300">API fora do ar</p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{estado.mensagem}</p>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          A API sobe com <code className="font-mono">npm run dev</code> dentro de{' '}
          <code className="font-mono">api/</code>.
        </p>
      </div>
    )
  }

  const bancoOk = estado.saude.banco === 'conectado'

  return (
    <div
      className={`rounded-lg border p-4 ${
        bancoOk
          ? 'border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/40'
          : 'border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40'
      }`}
    >
      <p
        className={`font-medium ${
          bancoOk
            ? 'text-green-700 dark:text-green-300'
            : 'text-amber-700 dark:text-amber-300'
        }`}
      >
        {bancoOk ? 'API ok · banco ok' : 'API ok · banco inacessível'}
      </p>
      {!bancoOk && (
        <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
          Suba o Postgres com <code className="font-mono">docker compose up -d</code> na raiz.
        </p>
      )}
    </div>
  )
}
