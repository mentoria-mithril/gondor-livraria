

export interface Book {
    id: number;
    titulo: string;
    autor: string;
    categoria: string;
    preco: string;
    capaUrl?: string;
}

export interface CartItem {
    bookId: number;
    quantity: number;
    book: Book;
    imageUrl?: string;
}

export interface SavedCartItem {
    id: string;
    bookId: number;
    title: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

export interface SavedCart {
    items: SavedCartItem[];
    total: number;
}
