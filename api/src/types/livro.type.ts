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
    preco: string,
    categoria: string,
    estoque: number
}

export interface LivroConsultaResponse {
    value: LivroConsultaDTO[],
    count: number
}