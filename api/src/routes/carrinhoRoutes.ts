import { Router } from "express";
import { atualizarQntItem, obterCarrinhoUsuarioAtual } from "../controllers/carrinhoController.js";
import { envolver } from "../middlewares/envolver.js";
import { atualizarQuantidadeItemCarrinho } from "../services/carrinhoService.js";

export const carrinhoRoutes = Router()

carrinhoRoutes.get('/carrinho', envolver(obterCarrinhoUsuarioAtual))
carrinhoRoutes.patch('/carrinho/itens/:id',envolver(atualizarQntItem));