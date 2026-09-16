import { Router } from 'express';
import { autenticarUsuario } from '../controllers/auth.Controlador.js';
import { envolver } from '../middlewares/envolver.js';

export const authRotas = Router();

authRotas.post('/login', envolver(autenticarUsuario));
