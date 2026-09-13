import type { Request, Response } from 'express'
import { LivroConsulta } from '../types/livro.type.js'
import { buscarLivros } from '../services/livroServico.js'

export async function obterLivros(req: Request, res: Response,): Promise<void> {
  const filtros: LivroConsulta = {
        busca: req.query.busca as string,
        categoria: req.query.categoria as string,
        pagina: Number.parseInt(req.query.pagina as string) || 1,
  }
  const livros = await buscarLivros(filtros)
  res.json(livros)
}