import type { Request, Response } from 'express'
import type { UserRegistrationInput } from '../schemas/userSchema.js'
import { registerUser } from '../services/userService.js'

export async function register(req: Request, res: Response): Promise<void> {
  const input = req.body as UserRegistrationInput
  const user = await registerUser(input)
  res.status(201).json(user)
}
