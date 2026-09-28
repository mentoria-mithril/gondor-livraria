import { Router } from 'express';
import { autenticarUsuario } from '../controllers/authController.js';
import { envolver } from '../middlewares/envolver.js';
import { loginUsuarioEsquema } from '../schemas/authEsquema.js';
import { validate } from '../middlewares/validate.js';

export const authRoutes = Router();

authRoutes.post('/login', validate(loginUsuarioEsquema), envolver(autenticarUsuario));
