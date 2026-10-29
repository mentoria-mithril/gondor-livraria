import { prisma } from './prisma.js'
import { Prisma } from '@prisma/client'

export const selectUser = {
    id: true,
    nome: true,
    email: true,
    dtCriacao: true,
} satisfies Prisma.UsuarioSelect

export type PublicUser = Prisma.UsuarioGetPayload<{ select: typeof selectUser }>

export async function findUserByEmail(email: string): Promise<PublicUser | null> {
    return prisma.usuario.findUnique({
        where: { email },
        select: selectUser,
    })
}

export async function createUserWithCart(data: {
    nome: string
    email: string
    senhaHash: string
}): Promise<PublicUser> {
    return prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: data.senhaHash,
            },
            select: selectUser,
        })

        await tx.carrinho.create({
            data: { usuarioId: usuario.id },
        })

        return usuario
    })
}

