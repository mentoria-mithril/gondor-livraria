import type { Request, Response } from 'express';
import * as carrinhoServico from '../services/carrinhoServico.js'
import { AdicionarItemCarrinhoDto } from '../dtos/itemCarrinhoDto.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';


export const salvarItemCarrinho = async (req: Request, res: Response) => {
    
    const usuarioId = req.header('x-usuario-id');
    if (!usuarioId) throw new ErroDeDominio('Informe o header x-usuario-id.', 401);

    const dados = AdicionarItemCarrinhoDto.parse(req.body);
    const item = await carrinhoServico.adicionarItemCarrinho(usuarioId, dados)
    res.status(201).json(item);
}
