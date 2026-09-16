import type { AdicionarItemCarrinhoDto } from '../schemas/carrinhoSchema.js';
import * as carrinhoRepository from '../repositories/carrinhoRepository.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';


export const salvarItem = async (usuarioId: string, dados: AdicionarItemCarrinhoDto) => {
    return carrinhoRepository.emTransacao(async (tx) => {
        const livro = await carrinhoRepository.buscarLivroPorId(tx, dados.livroId)

        if (!livro) throw new ErroDeDominio('Livro não encontrado.', 404)
        if (livro.estoque < dados.quantidade) throw new ErroDeDominio('Estoque insuficiente.', 409)

        const carrinho = await carrinhoRepository.garantirCarrinhoDoUsuario(tx, usuarioId)

        return carrinhoRepository.somarQuantidadeDoItem(
            tx,
            carrinho.id,
            dados.livroId,
            dados.quantidade,
        )
    });
}

export const deletarItem = async (usuarioId: string, livroId: number) => {
    const itensRemovidos = await carrinhoRepository.removerItemDoCarrinho(usuarioId, livroId)
    if (itensRemovidos === 0) throw new ErroDeDominio('Item não está no carrinho', 404);
}
