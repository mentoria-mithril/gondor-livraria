import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Prisma } from '@prisma/client'
import { prisma } from '../repositories/prisma.js'
import { getCart } from './cartService.js'


function fakeDb(itens: unknown[]) {
  Object.defineProperty(prisma, 'usuario', { value: { findUnique: async () => ({ id: 'usuario-1' }) }, configurable: true })
  Object.defineProperty(prisma, 'itemCarrinho', { value: { findMany: async () => itens }, configurable: true })
}

test('calcula preço unitário, subtotal de cada linha e o total do carrinho', async () => {
  const itensFalsos = [
    {
      id: 'item-1',
      carrinhoId: 'carrinho-1',
      livroId: 1,
      quantidade: 2,
      livro: {
        id: 1,
        titulo: 'Duna',
        preco: new Prisma.Decimal(50),
        estoque: 10,
      },
    },
    {
      id: 'item-2',
      carrinhoId: 'carrinho-1',
      livroId: 2,
      quantidade: 1,
      livro: {
        id: 2,
        titulo: '1984',
        preco: new Prisma.Decimal(30),
        estoque: 5,
      },
    },
  ]

  fakeDb(itensFalsos)

  const resultado = await getCart('usuario-1')

  assert.deepEqual(resultado, {
    items: [
      { id: 'item-1', bookId: 1, title: 'Duna', quantity: 2, subtotal: 100, unitPrice: 50 },
      { id: 'item-2', bookId: 2, title: '1984', quantity: 1, subtotal: 30, unitPrice: 30 },
    ],
    total: 130,
  })
})

test('devolve carrinho vazio quando o usuário ainda não tem carrinho', async () => {
  fakeDb([])

  const resultado = await getCart('usuario-2')

  assert.deepEqual(resultado, { items: [], total: 0 })
})
