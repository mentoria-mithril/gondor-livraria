import { Router } from 'express'
import { login } from '../controllers/authController.js'
import { envolver } from '../middlewares/envolver.js'
import { validate } from '../middlewares/validate.js'
import { loginSchema } from '../schemas/authSchema.js'

export const authRoutes = Router()

authRoutes.post('/auth', validate(loginSchema), envolver(login))
