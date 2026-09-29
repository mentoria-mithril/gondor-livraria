import { Prisma } from '@prisma/client';
import type { AddItemBody } from '../schemas/cartSchema.js';
import * as cartRepository from '../repositories/cartRepository.js';
import type { CartItem } from '../repositories/cartRepository.js';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';


export type CartDeps = {
    userExists: typeof cartRepository.userExists
    getBookById: typeof cartRepository.getBookById
    addItemToCart: typeof cartRepository.addItemToCart
    findCartItemsByUserId: typeof cartRepository.findCartItemsByUserId
    findCartItemOfUser: typeof cartRepository.findCartItemOfUser
    updateItemQuantity: typeof cartRepository.updateItemQuantity
    deleteItemFromCart: typeof cartRepository.deleteItemFromCart
}

const defaultDeps: CartDeps = { ...cartRepository }

export type CartItemResponse = {
    id: string,
    bookId: number,
    title: string,
    unitPrice: number,
    quantity: number,
    subtotal: number
}

export type CartResponse = {
    items: CartItemResponse[]
    total: number
}

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
    deps: CartDeps = defaultDeps
): Promise<CartItemResponse> {
    if (!(await deps.userExists(userId))) throw new ErroDeDominio('Usuário não encontrado.', 401);

    const book = await deps.getBookById(input.bookId);
    if (!book) throw new ErroDeDominio('Livro não encontrado.', 404);

    ensureStockAvailable(input.quantity, book.estoque);

    const addedItem = await deps.addItemToCart(userId, input.bookId, input.quantity);
    if (!addedItem) throw new ErroDeDominio('Quantidade não disponível em estoque.', 409);

    return toCartItem(addedItem);
}

export async function getCart(userId: string, deps: CartDeps = defaultDeps): Promise<CartResponse> {
    const items = await deps.findCartItemsByUserId(userId);

    return { items: items.map(toCartItem), total: sumTotal(items) }
}

export async function updateItemQuantity(
    userId: string,
    itemId: string,
    newQuantity: number,
    deps: CartDeps = defaultDeps
): Promise<CartItemResponse> {
    if (newQuantity <= 0)
        throw new ErroDeDominio('Quantidade deve ser maior que zero', 400);
    const item = await deps.findCartItemOfUser(userId, itemId);
    if (!item) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);

    ensureStockAvailable(newQuantity, item.livro.estoque);

    const updatedItem = await deps.updateItemQuantity(userId, itemId, newQuantity);
    if (!updatedItem) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);

    return toCartItem(updatedItem);
}

export async function removeItem(userId: string, itemId: string, deps: CartDeps = defaultDeps): Promise<void> {
    const removed = await deps.deleteItemFromCart(userId, itemId);
    if (removed === 0) throw new ErroDeDominio('Item não encontrado no carrinho.', 404);
}
