import { buscarCarrinhoUsuario } from "../repositorios/carrinhoRepository.js";

export async function obterCarrinhoUsuario(idUsuario: string) {
    const carrinho = await buscarCarrinhoUsuario(idUsuario);

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