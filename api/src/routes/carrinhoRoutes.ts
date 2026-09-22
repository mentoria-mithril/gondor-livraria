import { Router } from 'express';
import { salvarItemCarrinho, removerItemCarrinho } from '../controllers/carrinhoController.js';
import { envolver } from '../middlewares/envolver.js';
import { atualizarQntItem, obterCarrinhoUsuarioAtual } from "../controllers/carrinhoController.js";

export const carrinhoRotas = Router();

carrinhoRotas.post('/carrinho/itens', envolver(salvarItemCarrinho));
carrinhoRotas.delete('/carrinho/itens/:livroId', envolver(removerItemCarrinho))


export const carrinhoRoutes = Router()

carrinhoRoutes.get('/carrinho', envolver(obterCarrinhoUsuarioAtual))
carrinhoRoutes.patch('/carrinho/itens/:id',envolver(atualizarQntItem));
