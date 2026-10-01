import type { Request, Response } from 'express';
import type { loginUsuarioEntrada } from '../schemas/authEsquema.js';
import { autenticarUsuario as authService } from '../services/authService.js'

export async function autenticarUsuario(req: Request, res: Response): Promise<void> {
    const entrada = req.body as loginUsuarioEntrada;
    
    const usuario = await authService(entrada);
    res.status(200).json(usuario);
}
