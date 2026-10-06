'use client'

import { ShoppingCart } from 'lucide-react'

import { AppSidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { BOOKS_MOCK } from '@/mocks/books'
import { useCart } from '@/hooks/cart/use-cart'

/**
 * HOME MOCKADA — tela de teste.
 *
 * Não fala com a API: os livros vêm de `@/mocks/books` e o carrinho vive em
 * memória. Serve para exercitar Sidebar + CartItemCard enquanto o
 * `GET /cart/items` não existe.
 *
 * Quando a API entrar, só o `useCart` muda: `useState` vira `useEffect` +
 * fetch, e as três funções dele viram chamadas ao backend. Sidebar e
 * CartItemCard ficam intactos — é para isso que eles são controlados.
 */

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default function Home() {
  // O estado mora no hook, mas é chamado AQUI porque dois filhos precisam
  // dele: a lista adiciona, a sidebar exibe. O dono é o pai comum.
  const { items, error, addToCart, decreaseQuantity } = useCart()

  return (
    <SidebarProvider>
      <AppSidebar
        items={items}
        onIncrease={addToCart}
        onDecrease={decreaseQuantity}
      />

      <SidebarInset>
        <header className='flex items-center h-14 px-4 border-b border-border md:hidden'>
          <SidebarTrigger className="md:hidden" />
        </header>
        <main className="p-6">
          <h1 className="font-heading mb-1 text-2xl">Catálogo (mock)</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Tela de teste — livros falsos, carrinho salvo na API.
          </p>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          <ul className="flex flex-col gap-3">
            {BOOKS_MOCK.map((book) => (
              <li
                key={book.id}
                className="flex items-center justify-between gap-4 border border-border p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{book.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {book.autor} · {book.categoria}
                  </p>
                  <p className="mt-1 text-sm">{currencyFormatter.format(Number(book.preco))}</p>
                </div>

                <Button onClick={() => addToCart(book.id)} className="shrink-0">
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
