import type { Request, Response } from 'express';
import { loginUsuarioEsquema } from '../schemas/usuarioEsquema.js';
import { autenticarUsuario as authServico} from '../services/authServico.js'

export async function autenticarUsuario(req: Request, res: Response): Promise<void> {
    const entrada = loginUsuarioEsquema.parse(req.body);
    
    const usuario = await authServico(entrada);
    res.status(200).json(usuario);
}