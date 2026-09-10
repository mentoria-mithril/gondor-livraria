import express from 'express'
import cors from 'cors'
import { rotas } from './rotas/index.js'
import { tratadorDeErros } from './middlewares/tratadorDeErros.js'
import { rotaNaoEncontrada } from './middlewares/rotaNaoEncontrada.js'

/**
 * Monta o app sem subir servidor. Separado do index.ts de propósito: é isto que
 * permite um teste importar o app e chamar as rotas sem ocupar porta.
 */
export function criarServidor() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use('/api', rotas)

  // A ordem importa: 404 depois das rotas, tratador de erros por último.
  app.use(rotaNaoEncontrada)
  app.use(tratadorDeErros)

  return app
}
