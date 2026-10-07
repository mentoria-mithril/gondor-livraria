import { Router } from 'express'
import { register } from '../controllers/userController.js'
import { envolver } from '../middlewares/envolver.js'
import { validate } from '../middlewares/validate.js'
import { userRegistrationSchema } from '../schemas/userSchema.js'

export const userRoutes = Router()

userRoutes.post('/users', validate(userRegistrationSchema), envolver(register))
