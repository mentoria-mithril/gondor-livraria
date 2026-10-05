import type { Request, Response } from 'express';
import { RegisterUserInput, registerUserSchema } from '../schemas/userSchema.js';
import { registerUser as registerUserService } from '../services/userService.js';
import { PublicUser } from '../repositories/userRepository.js';

export async function registerUser(req: Request, res: Response): Promise<void> {
    const input: RegisterUserInput = registerUserSchema.parse(req.body);
    
    const user: PublicUser = await registerUserService(input);
    
    res.status(201).json(user);
}

