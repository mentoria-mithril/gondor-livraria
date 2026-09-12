import type { Request, Response } from 'express';
import { cadastroUsuarioEsquema } from '../esquemas/usuarioEsquema.js';
import { cadastrarUsuario as cadastrarUsuarioServico} from '../servicos/usuarioServico.js'

export async function cadastrarUsuario(req: Request, res: Response): Promise<void> {
    const entrada = cadastroUsuarioEsquema.parse(req.body);
    
    const usuario = await cadastrarUsuarioServico(entrada);
    res.status(201).json(usuario);
}