import { Router } from 'express';
import { salvarItemCarrinho, removerItemCarrinho } from '../controllers/cartController.js';
import { envolver } from '../middlewares/envolver.js';
import { atualizarQntItem, obterCarrinhoUsuarioAtual } from "../controllers/cartController.js";

export const cartRoutes = Router()

cartRoutes.post('/carrinho/itens', envolver(salvarItemCarrinho));
cartRoutes.delete('/carrinho/itens/:livroId', envolver(removerItemCarrinho))
cartRoutes.get('/carrinho', envolver(obterCarrinhoUsuarioAtual))
cartRoutes.patch('/carrinho/itens/:id',envolver(atualizarQntItem));
