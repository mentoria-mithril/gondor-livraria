import type { Prisma } from '@prisma/client'
import { prisma } from './prisma.js'
import type { CarrinhoDoUsuario } from '../services/cartService.js'

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
/*
    Função para buscar o carrinho de um usuário.
    primeiro pego o id do usuario,
    depois busco o carrinho do usuario
    depois busco os itens do carrinho do usuario 
    depois busco livro_id de cada item do carrinho do usuario
    retorno preco do livro (preciso do preço atualizado por isso não uso preco_unitario do item_pedido)
    e por fim retorno o carrinho do usuario com os itens do carrinho do usuario
    
*/

export async function buscarCarrinhoUsuario(idUsuario: string) {
    return prisma.carrinho.findUnique({
        where: {
            usuarioId: idUsuario
        },
        include: {
            itens: {
                include: {
                    livro: true
                }
            }
        }
    });
}

export async function buscarEstoqueItem(idDoItem: string) {
        return prisma.itemCarrinho.findUnique({
            where: {
                id: idDoItem
            },
            include:{
                livro: true
            }

        })
}

export async function atualizarQuantidadeItem(idDoItem: string, novaQuantidade:number) {
    return prisma.itemCarrinho.update({
        where: {id: idDoItem},
        data: {quantidade: novaQuantidade}
    });
    
}