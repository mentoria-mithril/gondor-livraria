import type { Request, Response } from 'express';
import { loginUsuarioEsquema } from '../schemas/usuarioEsquema.js';
import { autenticarUsuario as authService } from '../services/authService.js'

export async function autenticarUsuario(req: Request, res: Response): Promise<void> {
    const entrada = loginUsuarioEsquema.parse(req.body);
    
    const usuario = await authService(entrada);
    res.status(200).json(usuario);
}
