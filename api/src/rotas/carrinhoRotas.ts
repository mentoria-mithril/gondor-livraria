import { Router } from 'express';
import { salvarItemCarrinho } from '../controladores/carrinhoControlador.js';
import { envolver } from '../middlewares/envolver.js';

export const carrinhoRotas = Router();


carrinhoRotas.post('/carrinho/itens', envolver(salvarItemCarrinho));
