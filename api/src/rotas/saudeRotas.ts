import { Router } from 'express'
import { obterSaude } from '../controladores/saudeControlador.js'
import { envolver } from '../middlewares/envolver.js'

export const saudeRotas = Router()

// Handler async SEMPRE dentro de envolver() — veja o porquê em middlewares/envolver.ts
saudeRotas.get('/saude', envolver(obterSaude))
