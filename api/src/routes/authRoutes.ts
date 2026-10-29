import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
import { envolver } from '../middlewares/envolver.js';
import { autenticar } from '../middlewares/autenticar.js';

export const authRoutes = Router();

authRoutes.post('/auth', envolver(login));
authRoutes.delete('/auth', envolver(autenticar), envolver(logout));
