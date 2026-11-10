import * as orderService from '../services/orderService.js';
import * as orderRepository from '../repositories/orderRepository.js';
import { CreateOrderBody } from '../schemas/orderSchema.js';
import { UserIdHeader } from '../schemas/cartSchema.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';

function requireUserId(req: any): string {
    const parsed = UserIdHeader.safeParse(req.header('x-user-id'));
    if (!parsed.success) throw new ErroDeDominio('Informe um header x-user-id válido.', 401);
    return parsed.data;
}

export async function createOrder(req: any, res: any) {
    // pega o id do usuário
    const userId = requireUserId(req);
    const { total } = CreateOrderBody.parse(req.body ?? {});

    // verifica se o carrinho tem itens
    const cart = await orderRepository.findCartWithItems(userId);
    if (cart && cart.itens.length > 0) {
        const order = await orderService.createOrder(userId, total);
        console.log('Pedido criado:', order);
        res.status(201).json(order);
    } else {
        res.status(200).json({ mensagem: 'carrinho vazio' });
    }
}
