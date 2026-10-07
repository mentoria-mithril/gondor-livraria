import { chamar } from '../api'
import { SavedCart, SavedCartItem } from '../../types/cart/cartTypes'

const userHeader = { 'x-user-id': process.env.NEXT_PUBLIC_DEV_USER_ID ?? '' }

export async function getCart(): Promise<SavedCart> {
    return await chamar<SavedCart>('/cart', {
        headers: userHeader,
    })
}

export async function addCartItem(bookId: number, quantity: number): Promise<SavedCartItem> {
    return await chamar<SavedCartItem>('/cart/items', {
        method: 'POST',
        headers: userHeader,
        body: JSON.stringify({ bookId, quantity }),
    })
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<SavedCartItem> {
    return await chamar<SavedCartItem>(`/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: userHeader,
        body: JSON.stringify({ quantity }),
    })
}

export async function removeCartItem(itemId: string): Promise<void> {
    return await chamar<void>(`/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: userHeader,
    })
}