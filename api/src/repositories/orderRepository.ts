import { Prisma, StatusPedido } from '@prisma/client'
import { prisma } from './prisma.js'

export async function findCartWithItems(userId: string) {
    return prisma.carrinho.findUnique({
        where: { usuarioId: userId },
        include: { itens: { include: { livro: true } } },
    })
}

export async function findBook(bookId: number) {
    return prisma.livro.findUnique({ where: { id: bookId } })
}

export async function updateStock(bookId: number, newStock: number) {
    return prisma.livro.update({ where: { id: bookId }, data: { estoque: newStock } })
}

export async function createOrder(userId: string, total: number, status: StatusPedido) {
    return prisma.pedido.create({
        data: { usuarioId: userId, valorTotal: total, status },
    })
}

export async function addOrderItem(
    orderId: string,
    bookId: number,
    quantity: number,
    unitPrice: Prisma.Decimal,
) {
    return prisma.itemPedido.create({
        data: { pedidoId: orderId, livroId: bookId, quantidade: quantity, precoUnitario: unitPrice },
    })
}

export async function findOrderById(orderId: string) {
    return prisma.pedido.findUnique({
        where: { id: orderId },
        include: { itens: true, usuario: true },
    })
}
