import { ApiStatus } from '@/components/ApiStatus'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Bookstore</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Gondor team project starter. If the panel below is green, the environment is ready
          and you can pick up your feature.
        </p>
      </header>

      <ApiStatus />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          What each pair is building
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            <strong>Feature A — Account</strong> · registration, login, and authentication
          </li>
          <li>
            <strong>Feature B — Catalog</strong> · search, filters, pagination, and details
          </li>
          <li>
            <strong>Feature C — Cart</strong> · add, update, and remove items
          </li>
          <li>
            <strong>Feature D — Orders</strong> · checkout, inventory, and order history
          </li>
        </ul>
      </section>
      <p className="mt-4 text-sm">
        <Link href="/register" className="font-medium underline underline-offset-2">
          Create an account
        </Link>
      </p>
      <footer className="text-sm text-zinc-500">
        The full scope, data model, and acceptance criteria are in the{' '}
        <code className="font-mono">README.md</code> and the repository issues.
      </footer>
    </main>
  )
}
