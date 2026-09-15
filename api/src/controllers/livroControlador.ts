import type { Request, Response } from 'express'
import { LivroConsulta } from '../types/livro.type.js'
import { buscarLivros, buscarLivro } from '../services/livroServico.js'

export async function obterLivros(req: Request, res: Response): Promise<void> {

  const filtros: LivroConsulta = {
        busca: req.query.busca as string,
        categoria: req.query.categoria as string,
        pagina: Number.parseInt(req.query.pagina as string) || 1,
  }

  const livros = await buscarLivros(filtros);

  if (livros.count === 0) {
    res.json({ message: 'nenhum livro encontrado' })
    return
  }

  res.json(livros)
}

export async function obterLivroPorId(req: Request, res: Response): Promise<void> {
    const livro = await buscarLivro(req.params.id)
    res.status(200).json(livro)
}