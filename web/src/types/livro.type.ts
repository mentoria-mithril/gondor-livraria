
export interface LivroResponse {
  value: LivroConsultaDTO[]
  count: number
}

export interface LivroConsultaDTO {
    id: number;
    titulo: string;
    autor: string;
    preco: number;
    categoria: string;
    estoque: number;
}

export interface LivroDetalheDTO extends LivroConsultaDTO {
    sinopse: string;
    dtCriacao: string;
}