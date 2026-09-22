import type { AdicionarItemCarrinhoDto } from '../schemas/carrinhoSchema.js';
import * as carrinhoRepository from '../repositories/carrinhoRepository.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';
import { atualizarQuantidadeItem, buscarCarrinhoUsuario, buscarEstoqueItem } from "../repositories/carrinhoRepository.js";
export type ItemDoCarrinho = {
  id: string; livroId: number; titulo: string
  precoUnitario: number; quantidade: number; subtotal: number
}
export type CarrinhoDoUsuario = {
  itens: ItemDoCarrinho[]; total: number
}

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

export async function obterCarrinhoUsuario(idUsuario: string, buscarCarrinho = buscarCarrinhoUsuario) {
    const carrinho = await buscarCarrinho(idUsuario);

    if(!carrinho) 
        return {itens: [], total: 0}



//pegar de carrinho titulo, preço, calcular subtotal a cada linha e o total
/*
pego o carrinho LEMBRAR DE RENOMAR A VARIAVEL DO .MAP PARA itens e do .reduce para total
depois transformo para pegar titulo, preço (já convertento para number)
calculo preco do item X quantidade do item
uso reduce() para somar o acumulador + valorAtual a cada rodada do array

depois retorno {itens(.map()), total(.reduce())};

*/
    const itens = carrinho.itens.map((item)=>{
        const tituloLivro = item.livro.titulo;
        const precoItem = item.livro.preco.toNumber();
        const subtotalCompra = precoItem * item.quantidade;
        
        return{
            id: item.id,
            livroId: item.livroId,
            titulo: tituloLivro,
            quantidade: item.quantidade,
            subtotal: subtotalCompra,
            precoUnitario: precoItem
        }
    })
    const total = calcularTotal(itens);
    return {itens, total}
}

// pegar o valor e a quantidade da lista itens e usar reduce para somar o total

function calcularTotal(itens: {subtotal: number}[]): number {
    const total = itens.reduce((acumulado, itemAtual) => acumulado + itemAtual.subtotal,0)

    return total;
}

/**
 * validar (fast fail) <= 0 erro 400
 * buscar carrinho do usuario
 * validar se o carrinho é do usuario
 * buscar item no banco
 * validar de o item existe 
 * validar se a nova quantidade é maior que o existe no estoque (409)]\
 * salvar no banco
 */

export async function atualizarQuantidadeItemCarrinho(idUsuario: string, idDoItem: string, novaQuantidade: number) {
    if(novaQuantidade <= 0) 
        throw new ErroDeDominio("Quantidade deve ser maior que zero", 400);

    const item = await buscarEstoqueItem(idDoItem);
    const carrinhoUsuario = await buscarCarrinhoUsuario(idUsuario);
    
    validarRegrasCarrinho(novaQuantidade, carrinhoUsuario, item);

    const itemAtualizado = await atualizarQuantidadeItem(idDoItem,novaQuantidade)

    return itemAtualizado;
}

function verificaCarrinhoUsuario(carrinhoUsuario: CarrinhoDoUsuario | null){
    if(!carrinhoUsuario)
        throw new ErroDeDominio("Carrinho não encontrado", 404);
}

function verificaItemExiste(item: ItemDoCarrinho, idDoCarrinho: string){
    if(!item)
        throw new ErroDeDominio("Item não existetente", 404);
}

function verificaQntEstoque(novaQuantidade: number, estoqueDoLivro: number){
    if(novaQuantidade > estoqueDoLivro)
        throw new ErroDeDominio("Quantidade não disponivel", 409)
}

function validarRegrasCarrinho(novaQuantidade: number, carrinhoUsuario: any, item: any) {
    verificaCarrinhoUsuario(carrinhoUsuario);
    verificaItemExiste(item, carrinhoUsuario.id);
    verificaQntEstoque(novaQuantidade, item.livro.estoque);    
}
