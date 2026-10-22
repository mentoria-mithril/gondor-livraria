import { Prisma } from '@prisma/client';
import * as cartRepository from '../repositories/cartRepository.js';
import * as bookRepository from '../repositories/bookRepository.js';
import type { CartItem } from '../repositories/cartRepository.js';
import { prisma } from '../repositories/prisma.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';
import {CartItemResponse, CartResponse}  from '../types/cartTypes.js';

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

export async function addItem(
    userId: string,
    bookId: number,
    quantity: number
): Promise<CartItemResponse> {
    if (!(await cartRepository.findUserByEmail(userId))) throw new ErroDeDominio('Usuário não encontrado.', 401);

    const book = await bookRepository.getBookById(bookId);
    if (!book) throw new ErroDeDominio('Livro não encontrado.', 404);

    const addedItem: CartItem = await prisma.$transaction(async (tx) => {
        const cart = await cartRepository.findCartIdByUserId(tx, userId);
        if (!cart) throw new ErroDeDominio('Carrinho não encontrado.', 404);

        const { id } = await cartRepository.addItemToCart(tx, cart.id, bookId, quantity);
        const itemWithBook: CartItem = await cartRepository.findItemWithBook(tx, id);
        ensureStockAvailable(itemWithBook, quantity);

        return itemWithBook;
    });

    return toCartItem(addedItem);
}

function ensureStockAvailable(item: CartItem, requested: number): void {
    if (item.quantidade > item.livro.estoque)
        throw stockExceededError(item.livro.estoque, item.quantidade - requested, requested);
}

function stockExceededError(stock: number, inCart: number, requested: number): ErroDeDominio {
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
    if (!(await cartRepository.findUserByEmail(userId))) throw new ErroDeDominio('Usuário não encontrado.', 401);
    const items = await cartRepository.findCartItemsByUserId(userId);
    return { items: items.map(toCartItem), total: sumTotal(items) }
}

export async function updateItemQuantity(
    userId: string,
    itemId: string,
    newQuantity: number,
): Promise<CartItemResponse> {
    if (!(await cartRepository.findUserByEmail(userId))) throw new ErroDeDominio('Usuário não encontrado.', 401);

    if (newQuantity <= 0)
        throw new ErroDeDominio('Quantidade deve ser maior que zero', 400);
    const item = await cartRepository.findCartItemOfUser(userId, itemId);
    if (!item) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);

    const updatedItem = await cartRepository.updateItemQuantity(userId, itemId, newQuantity);
    if (!updatedItem) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);

    return toCartItem(updatedItem);
}

export async function removeItem(userId: string, itemId: string): Promise<void> {
    if (!(await cartRepository.findUserByEmail(userId))) throw new ErroDeDominio('Usuário não encontrado.', 401);
    const removed = await cartRepository.deleteItemFromCart(userId, itemId);
    if (removed === 0) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);
}
