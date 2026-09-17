'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'

import { AppSidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { LIVROS_MOCK } from '@/mocks/livros'
import type { ItemCarrinho, Livro } from '@/types/carrinho/CarrinhoTypes'

/**
 * HOME MOCKADA — tela de teste.
 *
 * Não fala com a API: os livros vêm de `@/mocks/livros` e o carrinho vive em
 * memória. Serve para exercitar Sidebar + CarrinhoItem enquanto o
 * `GET /carrinho/itens` não existe.
 *
 * Quando a API entrar, só ESTE arquivo muda: `useState` vira `useEffect` +
 * fetch, e as três funções abaixo viram chamadas ao backend. Sidebar e
 * CarrinhoItem ficam intactos — é para isso que eles são controlados.
 */

const formatador = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default function Home() {
  // O estado mora AQUI porque dois filhos precisam dele: a lista adiciona,
  // a sidebar exibe. O dono é o pai comum.
  const [itens, setItens] = useState<ItemCarrinho[]>([])

  function adicionar(livro: Livro) {
    // Forma de função (`atuais => ...`): garante que você parte do estado
    // mais recente, não de um valor capturado no render anterior.
    setItens((atuais) => {
      const jaEstaNoCarrinho = atuais.some((item) => item.livroId === livro.id)

      // Mesma regra do back: livro repetido SOMA quantidade, não duplica
      // linha — é o @@unique([carrinhoId, livroId]) do schema.prisma.
      if (jaEstaNoCarrinho) {
        return atuais.map((item) =>
          item.livroId === livro.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        )
      }

      return [...atuais, { livroId: livro.id, quantidade: 1, livro }]
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar itens={itens} />

      <SidebarInset>
        <header className='flex items-center h-14 px-4 border-b border-border md:hidden'>
          <SidebarTrigger className="md:hidden" />
        </header>
        <main className="p-6">
          <h1 className="font-heading mb-1 text-2xl">Catálogo (mock)</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Tela de teste — dados falsos, carrinho só em memória.
          </p>

          <ul className="flex flex-col gap-3">
            {LIVROS_MOCK.map((livro) => (
              <li
                key={livro.id}
                className="flex items-center justify-between gap-4 border border-border p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{livro.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {livro.autor} · {livro.categoria}
                  </p>
                  <p className="mt-1 text-sm">{formatador.format(Number(livro.preco))}</p>
                </div>

                <Button onClick={() => adicionar(livro)} className="shrink-0">
                  <ShoppingCart />
                  Adicionar
                </Button>
              </li>
            ))}
          </ul>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
