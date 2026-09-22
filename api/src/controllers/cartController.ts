import type { Request, Response } from 'express';
import * as carrinhoService from '../services/cartService.js'
import { AdicionarItemCarrinhoDto, RemoverItemCarrinhoDto } from '../schemas/carrinhoSchema.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';


export async function salvarItemCarrinho(req: Request, res: Response) {
    
    const usuarioId = req.header('x-usuario-id');
    if (!usuarioId) throw new ErroDeDominio('Informe o header x-usuario-id.', 401);

    const dados = AdicionarItemCarrinhoDto.parse(req.body);
    const item = await carrinhoService.salvarItem(usuarioId, dados)
    res.status(201).json(item);
}

export async function removerItemCarrinho(req: Request, res: Response) {
    const usuarioId = req.header('x-usuario-id');
    if (!usuarioId) throw new ErroDeDominio('Informe o header x-usuario-id.', 401);

    const {livroId} = RemoverItemCarrinhoDto.parse(req.params)
    await carrinhoService.deletarItem(usuarioId, livroId);
    res.status(204).send();
    
}

export async function obterCarrinhoUsuarioAtual(_req: Request,res: Response):Promise<void> {
    const idUsuario = "19f72583-ba26-4e15-993c-7d2d5e848190"; //TODO Trocar pelo id verdadeiro quando a fatia A
    //de autenticação for terminada
    const carrinho = await carrinhoService.obterCarrinhoUsuario(idUsuario);
    res.status(200).json(carrinho)
}

export async function atualizarQntItem(req: Request, res: Response):Promise<void> {
    const idUsuario = "19f72583-ba26-4e15-993c-7d2d5e848190"; //TODO Trocar pelo id verdadeiro quando a fatia A

    const idDoItem = req.params.id || "";

    const novaQuantidade = req.body.quantidade;

    const itemAtualizado = await carrinhoService.atualizarQuantidadeItemCarrinho(idUsuario, idDoItem, novaQuantidade);
    res.status(200).json(itemAtualizado);
}