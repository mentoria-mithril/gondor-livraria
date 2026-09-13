import type { Request, Response } from 'express';
import { cadastroUsuarioEsquema } from '../schemas/usuarioEsquema.js';
import { cadastrarUsuario as cadastrarUsuarioServico} from '../services/usuarioServico.js'

export async function cadastrarUsuario(req: Request, res: Response): Promise<void> {
    const entrada = cadastroUsuarioEsquema.parse(req.body);
    
    const usuario = await cadastrarUsuarioServico(entrada);
    res.status(201).json(usuario);
}