import type { Request,Response } from "express";
import { obterCarrinhoUsuario } from "../servicos/carrinhoService.js";

export async function obterCarrinhoUsuarioAtual(_req: Request,res: Response):Promise<void> {
    const idUsuario = "231"; //TODO Trocar pelo id verdadeiro quando a fatia A 
    //de autenticação for terminada
    const carrinho = await obterCarrinhoUsuario(idUsuario);
    res.status(200).json(carrinho)
}