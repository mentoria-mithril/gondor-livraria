import { Prisma } from "@prisma/client";
import {prisma} from "./prisma.js"

export const selectUsuarioAutenticacao ={
    id: true,
    nome: true,
    email: true,
    senha: true,
    dtCriacao: true,
} satisfies Prisma.UsuarioSelect;

export type UsuarioParaAutenticacao = Prisma.UsuarioGetPayload<{select: typeof selectUsuarioAutenticacao}>;

export async function buscarUsuarioParaAutenticacao(email: string): Promise<UsuarioParaAutenticacao | null> {
    return prisma.usuario.findUnique({ 
        where: { email }, 
        select: selectUsuarioAutenticacao,
    })
}



