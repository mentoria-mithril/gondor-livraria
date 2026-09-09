import type { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * Pegadinha do Express 4: se um handler `async` rejeitar, o Express NÃO chama o
 * tratador de erros. A requisição fica pendurada até dar timeout, e o cliente
 * nunca recebe resposta — nem 500.
 *
 * `envolver` liga o `.catch(next)` para você. **Todo handler async passa por
 * aqui**, sem exceção:
 *
 *   rotas.post('/livros', envolver(criarLivro))
 */
export function envolver(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next)
  }
}
