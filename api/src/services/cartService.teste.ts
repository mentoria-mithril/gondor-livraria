import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Prisma } from '@prisma/client'
import { ErroDeDominio } from '../errors/ErroDeDominio.js'
import * as cartService from './cartService.js'
import type { CartDeps } from './cartService.js'
import type { CartItem } from '../repositories/cartRepository.js'

/**
 * Testa o serviço sem banco: o repositório é injetado via `deps`, então
 * nenhuma chamada real ao Prisma acontece aqui.
 *
 * Rode com: npm run teste
 */

/**
 * Preenche as dependências não usadas com uma função que EXPLODE se for
 * chamada. Assim o teste também verifica o que o serviço *não* deveria fazer.
 */
function deps(overrides: Partial<CartDeps>): CartDeps {
  const shouldNotBeCalled = (name: string) => async (): Promise<never> => {
    throw new Error(`${name} não deveria ter sido chamado neste cenário`)
  }
  return {
    userExists: shouldNotBeCalled('userExists'),
    getBookById: shouldNotBeCalled('getBookById'),
    addItemToCart: shouldNotBeCalled('addItemToCart'),
    findCartItemsByUserId: shouldNotBeCalled('findCartItemsByUserId'),
    findCartItemOfUser: shouldNotBeCalled('findCartItemOfUser'),
    updateItemQuantity: shouldNotBeCalled('updateItemQuantity'),
    deleteItemFromCart: shouldNotBeCalled('deleteItemFromCart'),
    ...overrides,
  }
}

function cartItem(price: number | string, quantity: number, stock = 10, id = 'item-1', bookId = 1): CartItem {
  return {
    id,
    carrinhoId: 'carrinho-1',
    livroId: bookId,
    quantidade: quantity,
    livro: { id: bookId, titulo: `Livro ${bookId}`, preco: new Prisma.Decimal(price), estoque: stock },
  }
}

const isError = (status: number) => (erro: unknown) =>
  erro instanceof ErroDeDominio && erro.status === status

const existingUser = { userExists: async () => true }
const book = (stock: number) => async () => ({ id: 1, estoque: stock })

// ---------- addItem ----------

test('addItem devolve o item com preço em number', async () => {
  const item = await cartService.addItem('usuario-1', { bookId: 1, quantity: 2 }, deps({
    ...existingUser,
    getBookById: book(10),
    addItemToCart: async () => cartItem(50, 2),
  }))

  assert.deepEqual(item, { id: 'item-1', bookId: 1, title: 'Livro 1', unitPrice: 50, quantity: 2, subtotal: 100 })
})

test('addItem recusa com 401 quando o usuário do header não existe', async () => {
  await assert.rejects(
    cartService.addItem('fantasma', { bookId: 1, quantity: 1 }, deps({ userExists: async () => false })),
    isError(401),
  )
})

test('addItem recusa com 404 quando o livro não existe', async () => {
  await assert.rejects(
    cartService.addItem('usuario-1', { bookId: 99, quantity: 1 }, deps({
      ...existingUser,
      getBookById: async () => null,
    })),
    isError(404),
  )
})

test('addItem recusa com 409 e NÃO grava quando o pedido sozinho passa do estoque', async () => {
  await assert.rejects(
    cartService.addItem('usuario-1', { bookId: 1, quantity: 99 }, deps({
      ...existingUser,
      getBookById: book(3),
    })),
    isError(409),
  )
})

test('addItem recusa com 409 quando carrinho + pedido passa do estoque', async () => {
  // O repositório devolve null quando a soma estoura (e desfaz a transação).
  await assert.rejects(
    cartService.addItem('usuario-1', { bookId: 1, quantity: 3 }, deps({
      ...existingUser,
      getBookById: book(5),
      addItemToCart: async () => null,
    })),
    isError(409),
  )
})

// ---------- getCart ----------

test('getCart calcula subtotal de cada linha e o total', async () => {
  const cart = await cartService.getCart('usuario-1', deps({
    findCartItemsByUserId: async () => [cartItem(50, 2), cartItem(30, 1, 10, 'item-2', 2)],
  }))

  assert.deepEqual(cart, {
    items: [
      { id: 'item-1', bookId: 1, title: 'Livro 1', unitPrice: 50, quantity: 2, subtotal: 100 },
      { id: 'item-2', bookId: 2, title: 'Livro 2', unitPrice: 30, quantity: 1, subtotal: 30 },
    ],
    total: 130,
  })
})

test('getCart não acumula erro de float em dinheiro', async () => {
  // Em number: 19.90 * 3 = 59.699999999999996 e 0.1 + 0.2 = 0.30000000000000004
  const cart = await cartService.getCart('usuario-1', deps({
    findCartItemsByUserId: async () => [
      cartItem('19.90', 3),
      cartItem('0.10', 1, 10, 'item-2', 2),
      cartItem('0.20', 1, 10, 'item-3', 3),
    ],
  }))

  assert.equal(cart.items[0]?.subtotal, 59.7)
  assert.equal(cart.total, 60)
})

test('getCart devolve carrinho vazio quando o usuário ainda não tem carrinho', async () => {
  const cart = await cartService.getCart('usuario-2', deps({ findCartItemsByUserId: async () => [] }))

  assert.deepEqual(cart, { items: [], total: 0 })
})

// ---------- updateItemQuantity ----------

test('updateItemQuantity vira 404 para item inexistente ou de outro usuário', async () => {
  await assert.rejects(
    cartService.updateItemQuantity('usuario-1', 'item-alheio', 1, deps({
      findCartItemOfUser: async () => null,
    })),
    isError(404),
  )
})

test('updateItemQuantity recusa com 409 e NÃO grava quando falta estoque', async () => {
  await assert.rejects(
    cartService.updateItemQuantity('usuario-1', 'item-1', 11, deps({
      findCartItemOfUser: async () => cartItem(50, 2, 10),
    })),
    isError(409),
  )
})

test('updateItemQuantity vira 404 se o item sumiu entre a leitura e a escrita', async () => {
  await assert.rejects(
    cartService.updateItemQuantity('usuario-1', 'item-1', 3, deps({
      findCartItemOfUser: async () => cartItem(50, 2),
      updateItemQuantity: async () => null,
    })),
    isError(404),
  )
})

test('updateItemQuantity devolve o item atualizado', async () => {
  const item = await cartService.updateItemQuantity('usuario-1', 'item-1', 3, deps({
    findCartItemOfUser: async () => cartItem(50, 2),
    updateItemQuantity: async () => cartItem(50, 3),
  }))

  assert.equal(item.quantity, 3)
  assert.equal(item.subtotal, 150)
})

// ---------- removeItem ----------

test('removeItem vira 404 quando nada foi removido', async () => {
  await assert.rejects(
    cartService.removeItem('usuario-1', 'item-1', deps({ deleteItemFromCart: async () => 0 })),
    isError(404),
  )
})

test('removeItem conclui quando uma linha foi removida', async () => {
  await cartService.removeItem('usuario-1', 'item-1', deps({ deleteItemFromCart: async () => 1 }))
})
