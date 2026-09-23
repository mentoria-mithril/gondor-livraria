

export interface Livro {
    id: number;
    titulo: string;
    autor: string;
    categoria: string;
    preco: string;
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