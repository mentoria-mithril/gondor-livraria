import { Router } from 'express';
import { cadastrarUsuario } from '../controladores/usuarioControlador.js';
import { envolver } from '../middlewares/envolver.js';

export const usuarioRotas = Router();

usuarioRotas.post('/usuarios', envolver(cadastrarUsuario));