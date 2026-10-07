import type { Request, Response } from 'express'
import type { LoginInput } from '../schemas/authSchema.js'
import { authenticateUser } from '../services/authService.js'

export async function login(req: Request, res: Response): Promise<void> {
  const input = req.body as LoginInput
  const user = await authenticateUser(input)
  res.status(200).json(user)
}
