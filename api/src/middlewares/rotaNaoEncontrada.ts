import type { Request, Response } from 'express'

export function rotaNaoEncontrada(req: Request, res: Response): void {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.path}` })
}
