'use client';

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ShoppingCart} from "lucide-react";

interface AdicionarCarrinhoProps {
    preco: number;
    estoque: number;
}

export default function AdicionarCarrinho({preco, estoque}: Readonly<AdicionarCarrinhoProps>) {
    const [quantidade, setQuantidade] = useState(1);

    const precoFormatado = preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    const esgotado = estoque === 0;

    const diminuir = () => setQuantidade((atual) => Math.max(atual - 1, 1));
    const aumentar = () => setQuantidade((atual) => Math.min(atual + 1, estoque));

    return (
        <div className="flex items-center gap-4">
            <p className='text-2xl font-semibold'>{precoFormatado}</p>

            <div className="flex items-center gap-2">
                <Button onClick={diminuir} disabled={quantidade <=1}>-</Button>
                <span className='text-2xl font-semibold'>{quantidade}</span>
                <Button onClick={aumentar} disabled={quantidade >= estoque}>+</Button>
            </div>

            <Button className='flex-1' disabled={esgotado}>
                <ShoppingCart className='h-4 w-4'/>
                {esgotado ? 'Livro fora de estoque' : 'Adicionar ao Carrinho'}
            </Button>
        </div>
    );
}