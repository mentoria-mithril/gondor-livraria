import { Router } from 'express'
import { obterLivros } from '../controllers/livroControlador.js'
import { envolver } from '../middlewares/envolver.js'

export const livroRotas = Router()

livroRotas.get('/livros', envolver(obterLivros))
