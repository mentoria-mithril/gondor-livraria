import type { LivroConsultaDTO } from '@/types/livro.type'
import { Card } from '@/components/ui/card';

export default function CardLivro({ titulo, autor, categoria, preco, estoque }: LivroConsultaDTO) {
    return (
        <Card className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white p-4 shadow-md transition-transform">
            <h2 className="text-lg font-semibold">{titulo}</h2>
            <p className="text-sm text-gray-600">Autor: {autor}</p>
            <p className="text-sm text-gray-600">Categoria: {categoria}</p>
            <p className="text-sm text-gray-600">Preço: R$ {preco.toFixed(2)}</p>
            {estoque > 0 ? (
                <a href="#" className="text-sm text-blue-600 hover:underline">Ver detalhes</a>
            ) : (
                <p className="text-sm text-red-600">Indisponível</p>
            )}
        </Card>
    );
}