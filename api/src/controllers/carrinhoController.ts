import type { Request,Response } from "express";
import { atualizarQuantidadeItemCarrinho, obterCarrinhoUsuario } from "../services/carrinhoService.js";

export async function obterCarrinhoUsuarioAtual(_req: Request,res: Response):Promise<void> {
    const idUsuario = "19f72583-ba26-4e15-993c-7d2d5e848190"; //TODO Trocar pelo id verdadeiro quando a fatia A
    //de autenticação for terminada
    const carrinho = await obterCarrinhoUsuario(idUsuario);
    res.status(200).json(carrinho)
}

export async function atualizarQntItem(req: Request, res: Response):Promise<void> {
    const idUsuario = "19f72583-ba26-4e15-993c-7d2d5e848190"; //TODO Trocar pelo id verdadeiro quando a fatia A

    const idDoItem = req.params.id || "";

    const novaQuantidade = req.body.quantidade;

    const itemAtualizado = await atualizarQuantidadeItemCarrinho(idUsuario, idDoItem, novaQuantidade);
    res.status(200).json(itemAtualizado);
}