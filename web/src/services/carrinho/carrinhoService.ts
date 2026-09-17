import { chamar } from '../api'
import { ItemCarrinhoSalvo } from '../../types/carrinho/CarrinhoTypes'

export async function adicionarItemCarrinho(livroId: number, quantidade: number): Promise<ItemCarrinhoSalvo> {
    return await chamar<ItemCarrinhoSalvo>('/carrinho/itens', {
        method: 'POST',
        body: JSON.stringify({ livroId, quantidade }),
    })
}

export async function removerItemCarrinho(livroId: number): Promise<void> {
    return await chamar<void>(`/carrinho/itens/${livroId}`, {
        method: 'DELETE',
    })
}