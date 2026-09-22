import { Router } from 'express';
import { salvarItemCarrinho, removerItemCarrinho } from '../controllers/cartController.js';
import { envolver } from '../middlewares/envolver.js';
import { atualizarQntItem, obterCarrinhoUsuarioAtual } from "../controllers/cartController.js";

export const carrinhoRotas = Router();

carrinhoRotas.post('/carrinho/itens', envolver(salvarItemCarrinho));
carrinhoRotas.delete('/carrinho/itens/:livroId', envolver(removerItemCarrinho))


export const carrinhoRoutes = Router()

carrinhoRoutes.get('/carrinho', envolver(obterCarrinhoUsuarioAtual))
carrinhoRoutes.patch('/carrinho/itens/:id',envolver(atualizarQntItem));
