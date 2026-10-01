import { Router } from 'express';
import { cadastrarUsuario } from '../controllers/usuarioControlador.js';
import { envolver } from '../middlewares/envolver.js';
import { validate } from '../middlewares/validate.js';
import { cadastroUsuarioEsquema } from '../schemas/usuarioEsquema.js';

export const usuarioRotas = Router();

usuarioRotas.post('/usuarios', validate(cadastroUsuarioEsquema), envolver(cadastrarUsuario));
