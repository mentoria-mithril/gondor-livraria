import { Router } from 'express';
import { registerUser } from '../controllers/userController.js';
import { envolver } from '../middlewares/envolver.js';

export const userRoutes = Router();

userRoutes.post('/usuarios', envolver(registerUser));

