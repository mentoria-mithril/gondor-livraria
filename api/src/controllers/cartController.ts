import type { Request, Response } from 'express';
import * as cartService from '../services/cartService.js'
import { AddItemBody, ItemIdParams, UpdateQuantityBody, UserIdHeader } from '../schemas/cartSchema.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';

/**
 * Um lugar só para descobrir quem é o usuário. Quando a fatia A (autenticação)
 * terminar, isto vira `req.user.id` e nenhum handler muda.
 *
 * ponytail: o header é declarado pelo cliente — qualquer um pode se passar por
 * outro usuário. Aceitável só até a fatia A trocar por JWT.
 */
function requireUserId(req: Request): string {
    const parsed = UserIdHeader.safeParse(req.header('x-user-id'));
    if (!parsed.success) throw new ErroDeDominio('Informe um header x-user-id válido.', 401);
    return parsed.data;
}

export async function addItem(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req);
    const body = AddItemBody.parse(req.body);

    const item = await cartService.addItem(userId, body)
    res.status(201).json(item);
}

export async function getCart(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req);

    const cart = await cartService.getCart(userId);
    res.status(200).json(cart)
}

export async function updateItemQuantity(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req);
    const {itemId} = ItemIdParams.parse(req.params);
    const {quantity} = UpdateQuantityBody.parse(req.body);

    const updatedItem = await cartService.updateItemQuantity(userId, itemId, quantity);
    res.status(200).json(updatedItem);
}

export async function removeItem(req: Request, res: Response): Promise<void> {
    const userId = requireUserId(req);
    const {itemId} = ItemIdParams.parse(req.params);

    await cartService.removeItem(userId, itemId);
    res.status(204).send();
}
