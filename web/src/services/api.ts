/**
 * O ÚNICO lugar do front que chama a API. Tela não faz `fetch` — tela chama uma
 * função daqui. É isto que impede a URL da API de aparecer espalhada em 15
 * componentes no dia em que ela mudar.
 *
 * Cada fatia acrescenta as suas funções neste arquivo (ou num irmão dele):
 *   listarLivros(), obterCarrinho(), fecharPedido()...
 */

import {LivroDetalheDTO, LivroResponse} from "@/types/livro.type"

const URL_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api'

/** Erro que a API devolveu com uma mensagem — dá para mostrar na tela. */
export class ErroDaApi extends Error {
  readonly status: number

  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.name = 'ErroDaApi'
    this.status = status
  }
}

export async function chamar<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`${URL_BASE}${caminho}`, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', ...opcoes.headers },
    cache: 'no-store',
  })

  const corpo = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    // A API sempre devolve { erro: "..." }. Use a mensagem dela em vez de
    // inventar uma genérica na tela.
    throw new ErroDaApi(corpo?.erro ?? 'Não foi possível falar com a API.', resposta.status)
  }

  return corpo as T
}

export type Saude = {
  status: 'ok' | 'degradado'
  api: 'ok'
  banco: 'conectado' | 'inacessivel'
}

export function obterSaude(): Promise<Saude> {
  return chamar<Saude>('/saude')
}

export function listarLivros(busca?: string, categoria?: string, pagina = 1): Promise<LivroResponse> {
  const parametros = new URLSearchParams({ pagina: String(pagina) })

  if (busca || categoria) {
      if (busca) parametros.set('busca', busca)
      if (categoria) parametros.set('categoria', categoria)
  }

  return chamar<LivroResponse>(`/livros?${parametros.toString()}`)

}

export function obterLivroDetalhe(id: string): Promise<LivroDetalheDTO> {

  return chamar<LivroDetalheDTO>(`/livros/${id}`)

}