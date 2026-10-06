'use client'

import { createContext, useContext, useEffect, useState } from "react";
import type { SavedCartItem } from "@/types/cart/cartTypes";
import { addCartItem, getCart, removeCartItem, updateCartItemQuantity } from "@/services/cart/cartService";

type CartContextValue = {
    items: SavedCartItem[]
    error: string | null
    addToCart: (bookId: number) => Promise<void>
    decreaseQuantity: (bookId: number) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }){

    const [items, setItems] = useState<SavedCartItem[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getCart()
            .then((cart) => setItems(cart.items))
            .catch((err: Error) => setError(err.message))
    }, [])

    function upsert(saved: SavedCartItem) {
        setItems((current) =>
            current.some((item) => item.id === saved.id)
                ? current.map((item) => (item.id === saved.id ? saved : item))
                : [...current, saved],
        )
    }

    async function addToCart(bookId: number){
        try {
            setError(null)
            upsert(await addCartItem(bookId, 1))
        } catch (err) {
            setError((err as Error).message)
        }
    }


    async function decreaseQuantity(bookId: number){
        const item = items.find((i) => i.bookId === bookId)
        if (!item) return

        try {
            setError(null)
            if (item.quantity > 1) {
                upsert(await updateCartItemQuantity(item.id, item.quantity - 1))
            } else {
                await removeCartItem(item.id)
                setItems((current) => current.filter((i) => i.id !== item.id))
            }
        } catch (err) {
            setError((err as Error).message)
        }
    }

    return (
        <CartContext value={{ items, error, addToCart, decreaseQuantity }}>
            {children}
        </CartContext>
    )
}

export function useCart(){
    const cart = useContext(CartContext)
    if (!cart) throw new Error('useCart precisa estar dentro de <CartProvider>.')
    return cart
}
