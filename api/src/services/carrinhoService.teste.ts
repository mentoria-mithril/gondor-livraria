import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Prisma } from '@prisma/client'
import { obterCarrinhoUsuario } from './carrinhoService.js'

/**
 * Testa o serviço sem banco: a busca do carrinho é injetada como segundo
 * parâmetro, então nenhuma chamada real ao Prisma acontece aqui.
 *
 * Rode com: npm run teste
 */

test('calcula preço unitário, subtotal de cada linha e o total do carrinho', async () => {
  const carrinhoFalso = {
    id: 'carrinho-1',
    usuarioId: 'usuario-1',
    dtAtualizacao: new Date(),
    itens: [
      {
        id: 'item-1',
        carrinhoId: 'carrinho-1',
        livroId: 1,
        quantidade: 2,
        livro: {
          id: 1,
          titulo: 'Duna',
          autor: 'Frank Herbert',
          categoria: 'Ficção',
          sinopse: '...',
          preco: new Prisma.Decimal(50),
          estoque: 10,
          dtCriacao: new Date(),
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
          autor: 'George Orwell',
          categoria: 'Ficção',
          sinopse: '...',
          preco: new Prisma.Decimal(30),
          estoque: 5,
          dtCriacao: new Date(),
        },
      },
    ],
  }

  const buscarCarrinhoFalso = async () => carrinhoFalso

  const resultado = await obterCarrinhoUsuario('usuario-1', buscarCarrinhoFalso)

  assert.deepEqual(resultado, {
    itens: [
      { id: 'item-1', livroId: 1, titulo: 'Duna', quantidade: 2, subtotal: 100, precoUnitario: 50 },
      { id: 'item-2', livroId: 2, titulo: '1984', quantidade: 1, subtotal: 30, precoUnitario: 30 },
    ],
    total: 130,
  })
})

test('devolve carrinho vazio quando o usuário ainda não tem carrinho', async () => {
  const buscarCarrinhoFalso = async () => null

  const resultado = await obterCarrinhoUsuario('usuario-2', buscarCarrinhoFalso)

  assert.deepEqual(resultado, { itens: [], total: 0 })
})
