import type { Request, Response } from 'express';
import { loginSchema } from '../schemas/authSchema.js';
import { login as loginService, logout as logoutService } from '../services/authService.js';

export async function login(req: Request, res: Response): Promise<void> {
    const input = loginSchema.parse(req.body);
    const resultado = await loginService(input);
    res.status(200).json(resultado);
}

export async function logout(req: Request, res: Response): Promise<void> {
    await logoutService(req.token as string);
    res.status(204).end();
}
