import type { Request, Response } from 'express';
import { registerUserSchema } from '../schemas/userSchema.js';
import { registerUser as registerUserService } from '../services/userService.js';

export async function registerUser(req: Request, res: Response): Promise<void> {
    const input = registerUserSchema.parse(req.body);
    
    const user = await registerUserService(input);
    res.status(201).json(user);
}

