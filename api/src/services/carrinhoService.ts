import type { Prisma } from '@prisma/client';
import type { AdicionarItemCarrinhoDto } from '../schemas/carrinhoSchema.js';
import { prisma } from '../repositories/prisma.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';


export const salvarItem = async (usuarioId: string, dados: AdicionarItemCarrinhoDto) => {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const livro = await tx.livro.findUnique({ where: { id: dados.livroId } })

        if (!livro) throw new ErroDeDominio('Livro não encontrado.', 404)
        if (livro.estoque < dados.quantidade) throw new ErroDeDominio('Estoque insuficiente.', 409)

        const carrinho = await tx.carrinho.upsert({
            where: { usuarioId },
            update: {},
            create: { usuarioId },
        })


        return tx.itemCarrinho.upsert({
            where: { carrinhoId_livroId: { carrinhoId: carrinho.id, livroId: dados.livroId } },
            update: { quantidade: { increment: dados.quantidade } },
            create: { carrinhoId: carrinho.id, livroId: dados.livroId, quantidade: dados.quantidade },
        })
    });
}

export const deletarItem = async (usuarioId: string, livroId: number) => {
        const removeItemCarrinho = await prisma.itemCarrinho.deleteMany({
            where: { livroId, carrinho: { usuarioId } },
        })
        if(removeItemCarrinho.count === 0)throw new ErroDeDominio('Item não está no carrinho', 404);
        
    }
    


