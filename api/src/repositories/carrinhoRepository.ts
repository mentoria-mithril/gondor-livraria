import type { Prisma } from '@prisma/client'
import { prisma } from './prisma.js'


type ClientePrisma = Prisma.TransactionClient


export async function emTransacao<T>(operacao: (tx: ClientePrisma) => Promise<T>): Promise<T> {
  return prisma.$transaction(operacao)
}

export async function buscarLivroPorId(tx: ClientePrisma, livroId: number) {
  return tx.livro.findUnique({ where: { id: livroId } })
}


export async function garantirCarrinhoDoUsuario(tx: ClientePrisma, usuarioId: string) {
  return tx.carrinho.upsert({
    where: { usuarioId },
    update: {},
    create: { usuarioId },
  })
}

export async function somarQuantidadeDoItem(
  tx: ClientePrisma,
  carrinhoId: string,
  livroId: number,
  quantidade: number,
) {
  return tx.itemCarrinho.upsert({
    where: { carrinhoId_livroId: { carrinhoId, livroId } },
    update: { quantidade: { increment: quantidade } },
    create: { carrinhoId, livroId, quantidade },
  })
}


export async function removerItemDoCarrinho(
  usuarioId: string,
  livroId: number,
): Promise<number> {
  const { count } = await prisma.itemCarrinho.deleteMany({
    where: { livroId, carrinho: { usuarioId } },
  })
  return count
}
