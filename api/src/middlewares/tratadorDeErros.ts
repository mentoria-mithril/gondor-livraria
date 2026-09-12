import type { NextFunction, Request, Response } from 'express'
import { ErroDeDominio } from '../errors/ErroDeDominio.js'
import { ZodError } from 'zod'

/**
 * Último middleware da cadeia. É ele que decide o que o cliente vê quando algo
 * dá errado — nenhum controlador precisa montar resposta de erro na mão.
 */
export function tratadorDeErros(
  erro: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (erro instanceof ErroDeDominio) {
    res.status(erro.status).json({ erro: erro.message })
    return
  }

  if (erro instanceof ZodError) {
    res.status(400).json({
      erro: 'Dados inválidos.',
      campos: erro.issues.map((i) => ({ campo: i.path.join('.'), mensagem: i.message })),
    })
    return
  }

  // Chegou aqui: é bug. Loga inteiro no servidor e devolve pouco para o cliente
  // — mensagem de exceção pode vazar nome de tabela e caminho de arquivo.
  console.error('[erro não tratado]', erro)
  res.status(500).json({ erro: 'Erro interno.' })
}
