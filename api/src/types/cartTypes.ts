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

export type CartItemRequest = {
    userId: number
    bookId: string
    quantity: number
}