/**
 * Erro ESPERADO: o pedido do cliente não pôde ser atendido por uma regra de
 * negócio. Livro sem estoque, email já cadastrado, senha errada.
 *
 * Não é bug. Não precisa de try/catch no controlador: o tratadorDeErros pega
 * isto e transforma na resposta HTTP com o status certo.
 *
 *   throw new ErroDeDominio('Este email já está cadastrado.', 409)
 */
export class ErroDeDominio extends Error {
  readonly status: number

  constructor(mensagem: string, status = 400) {
    super(mensagem)
    this.name = 'ErroDeDominio'
    this.status = status
  }
}
