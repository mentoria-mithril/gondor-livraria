import { Prisma } from '@prisma/client';
import * as orderRepository from '../repositories/orderRepository.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';

type OrderLine = { price: number; quantity: number };

// função que calcula o total
export function calculateTotal(lines: OrderLine[]): number {
    return lines.reduce((acc, line) => acc + line.price * line.quantity, 0);
}

// cria o pedido
export async function createOrder(userId: string, informedTotal?: number) {
    // busca o carrinho
    const data = await orderRepository.findCartWithItems(userId);
    if (!data) throw new ErroDeDominio('Carrinho não encontrado.', 404);

    // o front já mostra o total na tela, então aproveita o que ele manda
    const t = informedTotal ?? calculateTotal(
        data.itens.map((item) => ({ price: item.livro.preco.toNumber(), quantity: item.quantidade })),
    );

    // const t = data.itens.reduce((acc, item) => acc + Number(item.livro.preco) * item.quantidade, 0);

    const order = await orderRepository.createOrder(userId, t, 'PAGO');

    // percorre os itens do carrinho
    for (const item of data.itens) {
        // busca o livro
        const book = await orderRepository.findBook(item.livroId);
        if (book && book.estoque >= item.quantidade) {
            // atualiza o estoque
            await orderRepository.updateStock(book.id, book.estoque - item.quantidade);
            await orderRepository.addOrderItem(order.id, item.livroId, item.quantidade, book.preco);
        } else {
            throw new ErroDeDominio('Estoque insuficiente.', 409);
        }
    }

    return orderRepository.findOrderById(order.id);
}
