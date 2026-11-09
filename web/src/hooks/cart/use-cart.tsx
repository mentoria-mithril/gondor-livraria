'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import type { SavedCartItem } from "@/types/cart/cartTypes";
import { addCartItem, getCart, removeCartItem, updateCartItemQuantity } from "@/services/cart/cartService";

type CartContextValue = {
    items: SavedCartItem[]
    addToCart: (bookId: number, quantity?: number) => Promise<void>
    decreaseQuantity: (bookId: number) => Promise<void>
    increaseQuantity: (bookId: number) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }){

    const [items, setItems] = useState<SavedCartItem[]>([])

    useEffect(() => {
        getCart()
            .then((cart) => setItems(cart.items))
            .catch((err: Error) => toast.error(err.message))
    }, [])

    function upsert(saved: SavedCartItem) {
        setItems((current) =>
            current.some((item) => item.id === saved.id)
                ? current.map((item) => (item.id === saved.id ? saved : item))
                : [...current, saved],
        )
    }

    async function addToCart(bookId: number, quantity: number = 1){
        try {
            upsert(await addCartItem(bookId, quantity))
        } catch (err) {
            toast.error((err as Error).message)
        }
    }
    async function increaseQuantity(bookId: number){
        const item = items.find((i) => i.bookId === bookId)
        if (!item) return

        try {
            upsert(await updateCartItemQuantity(item.id, item.quantity + 1))
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    async function decreaseQuantity(bookId: number){
        const item = items.find((i) => i.bookId === bookId)
        if (!item) return

        try {
            if (item.quantity > 1) {
                upsert(await updateCartItemQuantity(item.id, item.quantity - 1))
            } else {
                await removeCartItem(item.id)
                setItems((current) => current.filter((i) => i.id !== item.id))
            }
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    return (
        <CartContext value={{ items, addToCart, decreaseQuantity, increaseQuantity }}>
            {children}
        </CartContext>
    )
}

export function useCart(){
    const cart = useContext(CartContext)
    if (!cart) throw new Error('useCart precisa estar dentro de <CartProvider>.')
    return cart
}
