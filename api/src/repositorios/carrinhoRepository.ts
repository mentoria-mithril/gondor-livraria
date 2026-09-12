import { prisma } from "./prisma.js";
/*
    Função para buscar o carrinho de um usuário.
    primeiro pego o id do usuario,
    depois busco o carrinho do usuario
    depois busco os itens do carrinho do usuario 
    depois busco livro_id de cada item do carrinho do usuario
    retorno preco do livro (preciso do preço atualizado por isso não uso preco_unitario do item_pedido)
    e por fim retorno o carrinho do usuario com os itens do carrinho do usuario
    
*/

export async function buscarCarrinhoUsuario(idUsuario: string) {
    return prisma.carrinho.findUnique({
        where: {
            usuarioId: idUsuario
        },
        include: {
            itens: {
                include: {
                    livro: true
                }
            }
        }
    });
}