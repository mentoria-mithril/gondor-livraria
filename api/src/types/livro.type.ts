
export interface LivroConsulta {
    busca?: string,
    categoria?: string,
    pagina: number
}

export interface LivroConsultaQuantidade {
    busca?: string,
    categoria?: string
}

export interface LivroConsultaDTO {
    id: number 
    titulo: string,
    autor: string,
    preco: number,
    categoria: string,
    estoque: number
}

export interface LivroResponseDTO {
    id: number,
    titulo: string,
    autor: string,
    categoria: string,
    sinopse: string,
    preco: number,
    estoque: number,
    dtCriacao: string
}

export interface LivroConsultaResponse {
    value: LivroConsultaDTO[],
    count: number
}