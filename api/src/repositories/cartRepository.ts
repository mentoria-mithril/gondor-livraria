import { Prisma } from '@prisma/client'
import { prisma } from './prisma.js'
import { StockExceeded } from '../errors/StockExceeded.js'

const itemWithBook = {
    include: {
        livro: { select: { id: true, titulo: true, preco: true, estoque: true }},
    },
} satisfies Prisma.ItemCarrinhoDefaultArgs

export type CartItem = Prisma.ItemCarrinhoGetPayload<typeof itemWithBook>

export async function userExists(userId: string): Promise<boolean> {
    const user = await prisma.usuario.findUnique({ where: { id: userId }, select: { id: true } })
    return user !== null
}

export async function getBookById(id: number) {
    return prisma.livro.findUnique({
        where: { id },
        select: { id: true, estoque: true },
    })
}


export async function addItemToCart(
    userId: string,
    bookId: number,
    quantity: number
): Promise<CartItem> {
        return await prisma.$transaction(async (tx) => {
            await tx.carrinho.createMany({ data: [{ usuarioId: userId }], skipDuplicates: true })
            const cart = await tx.carrinho.findUniqueOrThrow({
                where: { usuarioId: userId },
                select: { id: true },
            })

            await tx.itemCarrinho.createMany({
                data: [{ carrinhoId: cart.id, livroId: bookId, quantidade: 0 }],
                skipDuplicates: true,
            })

            const item = await tx.itemCarrinho.update({
                where: { carrinhoId_livroId: { carrinhoId: cart.id, livroId: bookId } },
                data: { quantidade: { increment: quantity } },
                ...itemWithBook,
            })

            if (item.quantidade > item.livro.estoque)
                throw new StockExceeded(item.livro.estoque, item.quantidade - quantity)
            
            return item
        })
}

export async function findCartItemsByUserId(userId: string): Promise<CartItem[]> {
    return prisma.itemCarrinho.findMany({
        where: { carrinho: { usuarioId: userId } },
        orderBy: { livro: { titulo: 'asc' } },
        ...itemWithBook,
    })
}

export async function findCartItemOfUser(userId: string, itemId: string): Promise<CartItem | null> {
    return prisma.itemCarrinho.findFirst({
        where: { id: itemId, carrinho: { usuarioId: userId } },
        ...itemWithBook,
    })
}

export async function updateItemQuantity(
    userId: string,
    itemId: string,
    quantity: number
): Promise<CartItem | null> {
    try {
        return await prisma.itemCarrinho.update({
            where: { id: itemId, carrinho: { usuarioId: userId } },
            data: { quantidade: quantity },
            ...itemWithBook,
        })
    } catch (erro) {
        if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === 'P2025') return null
        throw erro
    }
}

export async function deleteItemFromCart(userId: string, itemId: string): Promise<number> {
    const { count } = await prisma.itemCarrinho.deleteMany({
        where: { id: itemId, carrinho: { usuarioId: userId } },
    })
    return count
}
