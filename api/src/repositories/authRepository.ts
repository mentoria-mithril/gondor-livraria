import { Prisma } from "@prisma/client";
import {prisma} from "./prisma.js"

export const selectUsuarioAutenticacao ={
    id: true,
    name: true,
    email: true,
    password: true,
    createdAt: true,
} satisfies Prisma.UserSelect;

export type UsuarioParaAutenticacao = Prisma.UserGetPayload<{select: typeof selectUsuarioAutenticacao}>;

export async function findUserForAuthentication(email: string): Promise<UsuarioParaAutenticacao | null> {
    return prisma.user.findUnique({ 
        where: { email }, 
        select: selectUsuarioAutenticacao,
    })
}



