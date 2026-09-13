import { prisma } from './prisma.js'
import { Prisma } from '@prisma/client';

export const selectUsuario = {
    id: true,
    nome: true,
    email: true,
    dtCriacao: true,
} satisfies Prisma.UsuarioSelect;

export type UsuarioPublico = Prisma.UsuarioGetPayload<{select: typeof selectUsuario}>;

// Aqui não retorna a senha, fiz apenas para verificar se o email já existe.
// só para cadastro; login deve usar outra função com senha
export async function buscarUsuarioPorEmail(email: string): Promise<UsuarioPublico | null> {
    return prisma.usuario.findUnique({ 
        where: { email }, 
        select: selectUsuario 
    })
}

export async function criarUsuarioComCarrinho(dados: {
    nome: string
    email: string
    senhaHash: string
}): Promise<UsuarioPublico> {
    return prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.create({
            data: {
                nome: dados.nome,
                email: dados.email,
                senha: dados.senhaHash,
            },
            select: selectUsuario,
        })

        await tx.carrinho.create({
            data: { usuarioId: usuario.id },
        })

        return usuario;
    })
}