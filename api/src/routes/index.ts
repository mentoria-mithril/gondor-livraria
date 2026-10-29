import { Router } from 'express'
import { saudeRotas } from './saudeRotas.js'
import { cartRoutes } from './cartRoutes.js'
import { userRoutes } from './userRoutes.js'
import { livroRotas } from './livroRotas.js'


/**
 * Tudo da API vive sob /api. Cada fatia acrescenta o seu router aqui:
 *
 *   rotas.use(userRoutes)       fatia A
 *   rotas.use(livroRotas)       fatia B
 *   rotas.use(carrinhoRotas)    fatia C
 *   rotas.use(pedidoRotas)      fatia D
 */
export const rotas = Router()

rotas.use(saudeRotas)
rotas.use(cartRoutes)

rotas.use(userRoutes)

rotas.use(livroRotas)