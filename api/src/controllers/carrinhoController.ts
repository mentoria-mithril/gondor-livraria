import type { Request, Response } from 'express';
import * as carrinhoService from '../services/carrinhoService.js'

import { AdicionarItemCarrinhoDto, RemoverItemCarrinhoDto } from '../schemas/carrinhoSchema.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';


export async function salvarItemCarrinho(req: Request, res: Response) {
    
    const usuarioId = req.header('x-usuario-id');
    if (!usuarioId) throw new ErroDeDominio('Informe o header x-usuario-id.', 401);

    const dados = AdicionarItemCarrinhoDto.parse(req.body);
    const item = await carrinhoService.salvarItem(usuarioId, dados)
    res.status(201).json(item);
}

export async function removerItemCarrinho(req: Request, res: Response) {
    const usuarioId = req.header('x-usuario-id');
    if (!usuarioId) throw new ErroDeDominio('Informe o header x-usuario-id.', 401);

    const {livroId} = RemoverItemCarrinhoDto.parse(req.params)
    await carrinhoService.deletarItem(usuarioId, livroId);
    res.status(204).send();
    
}

