import { Prisma } from '@prisma/client';
import type { AddItemBody } from '../schemas/cartSchema.js';
import * as cartRepository from '../repositories/cartRepository.js';
import type { CartItem } from '../repositories/cartRepository.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';
import {CartItemResponse, CartResponse, CartItemRequest}  from '../types/cartTypes.js';
import { StockExceeded } from '../errors/StockExceeded.js';

function subtotalOf(item: CartItem): Prisma.Decimal {
    return item.livro.preco.mul(item.quantidade)
}

function toCartItem(item: CartItem): CartItemResponse {
    return {
        id: item.id,
        bookId: item.livroId,
        title: item.livro.titulo,
        unitPrice: item.livro.preco.toNumber(),
        quantity: item.quantidade,
        subtotal: subtotalOf(item).toNumber(),
    }
}

function sumTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc.plus(subtotalOf(item)), new Prisma.Decimal(0)).toNumber()
}

function ensureStockAvailable(requested: number, stock: number) {
    if (requested > stock)
        throw new ErroDeDominio('Quantidade não disponível em estoque.', 409) 
}

export async function addItem(
    userId: string,
    input: AddItemBody,
): Promise<CartItemResponse> {
    if (!(await cartRepository.userExists(userId))) throw new ErroDeDominio('Usuário não encontrado.', 401);

    const book = await cartRepository.getBookById(input.bookId);
    if (!book) throw new ErroDeDominio('Livro não encontrado.', 404);

    try {
        const addedItem = await cartRepository.addItemToCart(userId, input.bookId, input.quantity);
        return toCartItem(addedItem);
    } catch (erro) {
        if (erro instanceof StockExceeded) throw stockExceededError(erro, input.quantity);
        throw erro;
    }
}

function stockExceededError({ stock, inCart }: StockExceeded, requested: number): ErroDeDominio {
    const available = stock - inCart;
    const hint = available > 0
        ? `Você pode adicionar no máximo ${available}.`
        : 'Você já tem todo o estoque disponível no carrinho.';

    return new ErroDeDominio(
        `Estoque insuficiente: há ${stock} unidades deste livro em estoque e você já tem ${inCart} no carrinho. ` +
        `Não é possível adicionar mais ${requested}. ${hint}`,
        409,
    );
}

export async function getCart(userId: string): Promise<CartResponse> {
    if (!(await cartRepository.userExists(userId))) throw new ErroDeDominio('Usuário não encontrado.', 401);
    const items = await cartRepository.findCartItemsByUserId(userId);

    return { items: items.map(toCartItem), total: sumTotal(items) }
}

export async function updateItemQuantity(
    userId: string,
    itemId: string,
    newQuantity: number,
): Promise<CartItemResponse> {
    if (!(await cartRepository.userExists(userId))) throw new ErroDeDominio('Usuário não encontrado.', 401);
    if (newQuantity <= 0)
        throw new ErroDeDominio('Quantidade deve ser maior que zero', 400);
    const item = await cartRepository.findCartItemOfUser(userId, itemId);
    if (!item) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);

    ensureStockAvailable(newQuantity, item.livro.estoque);

    const updatedItem = await cartRepository.updateItemQuantity(userId, itemId, newQuantity);
    if (!updatedItem) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);

    return toCartItem(updatedItem);
}

export async function removeItem(userId: string, itemId: string): Promise<void> {
    const removed = await cartRepository.deleteItemFromCart(userId, itemId);
    if (removed === 0) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);
}
