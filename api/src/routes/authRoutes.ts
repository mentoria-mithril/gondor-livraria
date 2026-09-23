import { Router } from 'express';
import { autenticarUsuario } from '../controllers/authController.js';
import { envolver } from '../middlewares/envolver.js';

export const authRoutes = Router();

authRoutes.post('/login', envolver(autenticarUsuario));
