import { Router } from 'express';
import { salvarItemCarrinho } from '../controllers/carrinhoControlador.js';
import { envolver } from '../middlewares/envolver.js';

export const carrinhoRotas = Router();


carrinhoRotas.post('/carrinho/itens', envolver(salvarItemCarrinho));
