
import { prisma } from './prisma.js'


export async function getBookById(id: number) {
    return prisma.livro.findUnique({
        where: { id },
        select: { id: true, estoque: true },
    })
}