import { StatusDaApi } from '@/componentes/StatusDaApi'

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Livraria</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Esqueleto do projeto da turma Gondor. Se o quadro abaixo estiver verde, o
          ambiente está inteiro e você pode pegar a sua fatia.
        </p>
      </header>

      <StatusDaApi />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          O que cada dupla constrói aqui
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            <strong>Fatia A — Conta</strong> · cadastro, login e autenticação
          </li>
          <li>
            <strong>Fatia B — Catálogo</strong> · busca, filtro, paginação e detalhe
          </li>
          <li>
            <strong>Fatia C — Carrinho</strong> · adicionar, somar, alterar e remover
          </li>
          <li>
            <strong>Fatia D — Pedido</strong> · checkout, estoque e histórico
          </li>
        </ul>
      </section>

      <footer className="text-sm text-zinc-500">
        O escopo completo, o modelo de dados e os critérios de aceite estão no{' '}
        <code className="font-mono">README.md</code> e nas issues do repositório.
      </footer>
    </main>
  )
}
