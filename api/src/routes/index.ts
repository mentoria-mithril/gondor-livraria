import { Router } from 'express'
import { saudeRotas } from './saudeRotas.js'

/**
 * Tudo da API vive sob /api. Cada fatia acrescenta o seu router aqui:
 *
 *   rotas.use(usuarioRotas)     fatia A
 *   rotas.use(livroRotas)       fatia B
 *   rotas.use(carrinhoRotas)    fatia C
 *   rotas.use(pedidoRotas)      fatia D
 */
export const rotas = Router()

rotas.use(saudeRotas)
