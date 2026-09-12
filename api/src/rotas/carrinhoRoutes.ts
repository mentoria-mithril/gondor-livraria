import { Router } from "express";
import { obterCarrinhoUsuarioAtual } from "../controladores/carrinhoController.js";
import { envolver } from "../middlewares/envolver.js";

export const carrinhoRoutes = Router()

carrinhoRoutes.get('/carrinho', envolver(obterCarrinhoUsuarioAtual))