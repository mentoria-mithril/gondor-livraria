import type { NextFunction, Request, Response } from 'express'
import { ErroDeDominio } from '../errors/ErroDeDominio.js'
import { usuarioDaSessao } from '../services/authService.js'

declare global {
  namespace Express {
    interface Request {
      usuarioId?: string
      token?: string
    }
  }
}

/**
 * Lê `Authorization: Bearer <token>`, confere a sessão no banco e põe o dono em
 * `req.usuarioId`. Rota protegida só usa `req.usuarioId`, nunca o que o cliente manda.
 * É async: registre com `envolver(autenticar)`.
 */
export async function autenticar(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const [tipo, token] = (req.header('authorization') ?? '').split(' ')
  if (tipo !== 'Bearer' || !token) {
    throw new ErroDeDominio('Faça login para continuar.', 401)
  }

  req.usuarioId = await usuarioDaSessao(token)
  req.token = token
  next()
}
