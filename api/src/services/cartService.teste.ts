import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Prisma } from '@prisma/client'
import { prisma } from '../repositories/prisma.js'
import { getCart, addItem, updateItemQuantity, removeItem } from './cartService.js'
import { ErroDeDominio } from '../errors/ErroDeDominio.js'
import { StockExceeded } from '../errors/StockExceeded.js'

/**
 * Troca as partes do prisma que o repositório usa por versões falsas.
 * O usuário existe por padrão; passe `usuario: null` para simular que não existe.
 */
function fakeDb(fakes: {
  usuario?: { id: string } | null
  livro?: { id: number; estoque: number } | null
  itemCarrinho?: Record<string, unknown>
  $transaction?: () => Promise<unknown>
} = {}) {
  const usuario = 'usuario' in fakes ? fakes.usuario : { id: 'usuario-1' }
  const replace = (key: string, value: unknown) =>
    Object.defineProperty(prisma, key, { value, configurable: true })

  replace('usuario', { findUnique: async () => usuario })
  replace('livro', { findUnique: async () => fakes.livro ?? null })
  replace('itemCarrinho', fakes.itemCarrinho ?? {})
  replace('$transaction', fakes.$transaction ?? (async () => { throw new Error('$transaction não deveria ser chamado') }))
}

function itemFalso(preco: number | string, quantidade: number, id = 'item-1', livroId = 1) {
  return {
    id,
    carrinhoId: 'carrinho-1',
    livroId,
    quantidade,
    livro: { id: livroId, titulo: `Livro ${livroId}`, preco: new Prisma.Decimal(preco), estoque: 10 },
  }
}

const erroComStatus = (status: number) => (erro: unknown) =>
  erro instanceof ErroDeDominio && erro.status === status

// ---------- getCart ----------

test('getCart calcula preço unitário, subtotal de cada linha e o total do carrinho', async () => {
  fakeDb({ itemCarrinho: { findMany: async () => [itemFalso(50, 2), itemFalso(30, 1, 'item-2', 2)] } })

  const resultado = await getCart('usuario-1')

  assert.deepEqual(resultado, {
    items: [
      { id: 'item-1', bookId: 1, title: 'Livro 1', quantity: 2, subtotal: 100, unitPrice: 50 },
      { id: 'item-2', bookId: 2, title: 'Livro 2', quantity: 1, subtotal: 30, unitPrice: 30 },
    ],
    total: 130,
  })
})

test('getCart devolve carrinho vazio quando o usuário ainda não tem carrinho', async () => {
  fakeDb({ itemCarrinho: { findMany: async () => [] } })

  assert.deepEqual(await getCart('usuario-2'), { items: [], total: 0 })
})

test('getCart não acumula erro de float em dinheiro', async () => {
  // Com number puro: 19.90 * 3 = 59.699999999999996 e 0.1 + 0.2 = 0.30000000000000004
  fakeDb({
    itemCarrinho: {
      findMany: async () => [itemFalso('19.90', 3), itemFalso('0.10', 1, 'item-2', 2), itemFalso('0.20', 1, 'item-3', 3)],
    },
  })

  const resultado = await getCart('usuario-1')

  assert.equal(resultado.items[0]?.subtotal, 59.7)
  assert.equal(resultado.total, 60)
})

test('getCart recusa com 401 quando o usuário não existe', async () => {
  fakeDb({ usuario: null })

  await assert.rejects(getCart('fantasma'), erroComStatus(401))
})

// ---------- addItem ----------

test('addItem devolve o item adicionado com preço em number', async () => {
  fakeDb({ livro: { id: 1, estoque: 10 }, $transaction: async () => itemFalso(50, 2) })

  const item = await addItem('usuario-1', { bookId: 1, quantity: 2 })

  assert.deepEqual(item, { id: 'item-1', bookId: 1, title: 'Livro 1', unitPrice: 50, quantity: 2, subtotal: 100 })
})

test('addItem recusa com 401 quando o usuário não existe', async () => {
  fakeDb({ usuario: null })

  await assert.rejects(addItem('fantasma', { bookId: 1, quantity: 1 }), erroComStatus(401))
})

test('addItem recusa com 404 quando o livro não existe', async () => {
  fakeDb({ livro: null })

  await assert.rejects(addItem('usuario-1', { bookId: 99, quantity: 1 }), erroComStatus(404))
})

test('addItem vira 409 dizendo quanto ainda dá para adicionar quando estoura o estoque', async () => {
  // estoque 5, já tem 3 no carrinho, pediu mais 4 → cabem só 2
  fakeDb({ livro: { id: 1, estoque: 5 }, $transaction: async () => { throw new StockExceeded(5, 3) } })

  await assert.rejects(addItem('usuario-1', { bookId: 1, quantity: 4 }), (erro) =>
    erroComStatus(409)(erro) && (erro as Error).message.includes('no máximo 2'))
})

test('addItem vira 409 avisando que o estoque inteiro já está no carrinho', async () => {
  fakeDb({ livro: { id: 1, estoque: 5 }, $transaction: async () => { throw new StockExceeded(5, 5) } })

  await assert.rejects(addItem('usuario-1', { bookId: 1, quantity: 1 }), (erro) =>
    erroComStatus(409)(erro) && (erro as Error).message.includes('todo o estoque disponível'))
})

test('addItem repassa erros que não são de estoque sem transformar', async () => {
  const falhaDoBanco = new Error('conexão caiu')
  fakeDb({ livro: { id: 1, estoque: 5 }, $transaction: async () => { throw falhaDoBanco } })

  await assert.rejects(addItem('usuario-1', { bookId: 1, quantity: 1 }), (erro) => erro === falhaDoBanco)
})

// ---------- updateItemQuantity ----------

test('updateItemQuantity devolve o item com a nova quantidade e subtotal', async () => {
  fakeDb({ itemCarrinho: { findFirst: async () => itemFalso(50, 2), update: async () => itemFalso(50, 3) } })

  const item = await updateItemQuantity('usuario-1', 'item-1', 3)

  assert.equal(item.quantity, 3)
  assert.equal(item.subtotal, 150)
})

test('updateItemQuantity recusa com 401 quando o usuário não existe', async () => {
  fakeDb({ usuario: null })

  await assert.rejects(updateItemQuantity('fantasma', 'item-1', 1), erroComStatus(401))
})

test('updateItemQuantity recusa com 400 quantidade zero ou negativa', async () => {
  fakeDb()

  await assert.rejects(updateItemQuantity('usuario-1', 'item-1', 0), erroComStatus(400))
  await assert.rejects(updateItemQuantity('usuario-1', 'item-1', -1), erroComStatus(400))
})

test('updateItemQuantity vira 404 para item inexistente ou de outro usuário', async () => {
  fakeDb({ itemCarrinho: { findFirst: async () => null } })

  await assert.rejects(updateItemQuantity('usuario-1', 'item-alheio', 1), erroComStatus(404))
})

test('updateItemQuantity vira 404 se o item sumiu entre a leitura e a escrita', async () => {
  // P2025 é o código do Prisma para "registro não encontrado" no update
  const naoEncontrado = new Prisma.PrismaClientKnownRequestError('não encontrado', { code: 'P2025', clientVersion: 'teste' })
  fakeDb({ itemCarrinho: { findFirst: async () => itemFalso(50, 2), update: async () => { throw naoEncontrado } } })

  await assert.rejects(updateItemQuantity('usuario-1', 'item-1', 3), erroComStatus(404))
})

// ---------- removeItem ----------

test('removeItem conclui quando uma linha foi removida', async () => {
  fakeDb({ itemCarrinho: { deleteMany: async () => ({ count: 1 }) } })

  await removeItem('usuario-1', 'item-1')
})

test('removeItem vira 404 quando nada foi removido', async () => {
  fakeDb({ itemCarrinho: { deleteMany: async () => ({ count: 0 }) } })

  await assert.rejects(removeItem('usuario-1', 'item-1'), erroComStatus(404))
})

test('removeItem recusa com 401 quando o usuário não existe', async () => {
  fakeDb({ usuario: null })

  await assert.rejects(removeItem('fantasma', 'item-1'), erroComStatus(401))
})
