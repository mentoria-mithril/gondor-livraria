import { Router } from 'express'
import { saudeRotas } from './saudeRotas.js'
import { userRoutes } from './userRoutes.js'
import { authRoutes } from './authRoutes.js'
/** Mount each feature router under /api. */
export const rotas = Router()

rotas.use(saudeRotas)
rotas.use(userRoutes)
rotas.use(authRoutes)
