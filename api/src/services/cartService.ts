import { Prisma } from '@prisma/client';
import * as cartRepository from '../repositories/cartRepository.js';
import * as bookRepository from '../repositories/bookRepository.js';
import type { CartItem } from '../repositories/cartRepository.js';
import { prisma, Tx } from '../repositories/prisma.js';
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

    const addedItem: CartItem = await prisma.$transaction(async (tx: Tx) => {
        const cart = await cartRepository.findCartIdByUserId(tx, userId);
        if (!cart) throw new ErroDeDominio('Carrinho não encontrado.', 404);

        const { id } = await cartRepository.addItemToCart(tx, cart.id, bookId, quantity);
        const itemWithBook: CartItem = await cartRepository.findItemWithBook(tx, id);
        ensureStockAvailable(itemWithBook.quantidade, itemWithBook.livro.estoque);

        return itemWithBook;
    });

    return toCartItem(addedItem);
}

function ensureStockAvailable(finalQuantity: number, stock: number): void {
    if (finalQuantity > stock) {
        throw new ErroDeDominio(
            `Estoque insuficiente: há ${stock} unidades deste livro e o carrinho ficaria com ${finalQuantity}.`,
            409,
        );
    }
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
    
    const item = await cartRepository.findCartItemOfUser(userId, itemId);
    if (!item) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);

    ensureStockAvailable(newQuantity, item.livro.estoque);

    const updatedItem = await cartRepository.updateItemQuantity(userId, itemId, newQuantity);

    return toCartItem(updatedItem);
}

export async function removeItem(userId: string, itemId: string): Promise<void> {
    if (!(await cartRepository.findUserByEmail(userId))) throw new ErroDeDominio('Usuário não encontrado.', 401);
    const removed = await cartRepository.deleteItemFromCart(userId, itemId);
    if (removed === 0) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);
}
