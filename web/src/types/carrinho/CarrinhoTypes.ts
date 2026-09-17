/**
 * O formato que o FRONT recebe — não é o formato da tabela.
 *
 * A tabela `item_carrinho` guarda só `livroId` e `quantidade`; o GET do
 * carrinho faz `include: { livro: true }` e devolve o livro junto. É esse
 * retorno que a tela tipa aqui.
 */

export interface Livro {
    id: number;
    titulo: string;
    autor: string;
    categoria: string;
    preco: string; // Decimal do Prisma vira STRING no JSON. Converta antes de somar.
}

export interface ItemCarrinho {
    livroId: number;
    quantidade: number;
    livro: Livro;
}

export interface ItemCarrinhoSalvo { 
    carrinhoId: string;
    livroId: number;
    quantidade: number;
}