import { Router } from 'express';
import { salvarItemCarrinho, removerItemCarrinho } from '../controllers/carrinhoController.js';
import { envolver } from '../middlewares/envolver.js';

export const carrinhoRotas = Router();


carrinhoRotas.post('/carrinho/itens', envolver(salvarItemCarrinho));
carrinhoRotas.delete('/carrinho/itens:livroId', envolver(removerItemCarrinho))
