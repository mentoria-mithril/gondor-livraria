import { prisma } from './prisma.js'
import { Prisma } from '@prisma/client'
import { selectUser } from './userRepository.js'

const selectUsuarioComSenha = {
    ...selectUser,
    senha: true,
} satisfies Prisma.UsuarioSelect

export type UsuarioComSenha = Prisma.UsuarioGetPayload<{ select: typeof selectUsuarioComSenha }>

export type SessaoSalva = {
    usuarioId: string
    expiraEm: Date
}

export async function findUserForAuthentication(email: string): Promise<UsuarioComSenha | null> {
    return prisma.usuario.findUnique({
        where: { email },
        select: selectUsuarioComSenha,
    })
}

export async function criarSessao(data: { token: string; usuarioId: string; expiraEm: Date }): Promise<void> {
    await prisma.sessao.create({ data })
}

export async function buscarSessao(token: string): Promise<SessaoSalva | null> {
    return prisma.sessao.findUnique({
        where: { token },
        select: { usuarioId: true, expiraEm: true },
    })
}

export async function apagarSessao(token: string): Promise<void> {
    await prisma.sessao.deleteMany({ where: { token } })
}
