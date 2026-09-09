import type { Request, Response } from 'express'
import { verificarSaude } from '../servicos/saudeServico.js'

/**
 * Controlador só traduz HTTP: chama o serviço e escolhe o código de resposta.
 * Nenhuma decisão de negócio mora aqui.
 */
export async function obterSaude(_req: Request, res: Response): Promise<void> {
  const saude = await verificarSaude()
  res.status(saude.status === 'ok' ? 200 : 503).json(saude)
}
