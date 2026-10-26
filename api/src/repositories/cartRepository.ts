import { Prisma } from '@prisma/client'
import { prisma, type Tx } from './prisma.js'

const itemWithBook = {
    include: {
        livro: { select: { id: true, titulo: true, preco: true, estoque: true }},
    },
} satisfies Prisma.ItemCarrinhoDefaultArgs

export type CartItem = Prisma.ItemCarrinhoGetPayload<typeof itemWithBook>

export function withTransaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
    return prisma.$transaction(fn)
}


//refatorar Após merge
export async function findUserByEmail(userId: string): Promise<boolean> {
    const user = await prisma.usuario.findUnique({ where: { id: userId }, select: { id: true } })
    return user !== null
}

export async function addItemToCart (
    tx: Tx,
    cartId: string,
    bookId: number,
    quantity: number
){
    return tx.itemCarrinho.upsert({
        where: { carrinhoId_livroId: { carrinhoId: cartId, livroId: bookId } },
        create: { carrinhoId: cartId, livroId: bookId, quantidade: quantity},
        update: {quantidade: {increment: quantity}},
        select: { id: true}
    })
}

export async function findCartIdByUserId(tx: Tx, userId: string) {
    return tx.carrinho.findUnique({ where: { usuarioId: userId }, select: { id: true } })
}

export async function findItemWithBook(tx: Tx, itemId: string): Promise<CartItem> {
    return tx.itemCarrinho.findUniqueOrThrow({ where: { id: itemId }, ...itemWithBook })
}


export async function findCartItemsByUserId(userId: string): Promise<CartItem[]> {
    return prisma.itemCarrinho.findMany({
        where: { carrinho: { usuarioId: userId } },
        orderBy: { livro: { titulo: 'asc' } },
        ...itemWithBook,
    })
}

export async function findCartItemOfUser(userId: string, itemId: string): Promise<CartItem | null>{
    return prisma.itemCarrinho.findFirst({
        where: { id: itemId, carrinho: { usuarioId: userId } },
        ...itemWithBook,
    })
}

export async function updateItemQuantity(
    userId: string,
    itemId: string,
    quantity: number
): Promise<CartItem> {
    return prisma.itemCarrinho.update({
        where: { id: itemId, carrinho: { usuarioId: userId } },
        data: { quantidade: quantity },
        ...itemWithBook,
    })
}

export async function deleteItemFromCart(userId: string, itemId: string): Promise<number> {
    const { count } = await prisma.itemCarrinho.deleteMany({
        where: { id: itemId, carrinho: { usuarioId: userId } },
    })
    return count
}
