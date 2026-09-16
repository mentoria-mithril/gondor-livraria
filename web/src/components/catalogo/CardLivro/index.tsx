import type { LivroConsultaDTO } from '@/types/livro.type'
import { Card } from '@/components/ui/card';
import Link from "next/link";

export default function CardLivro({ id, titulo, autor, categoria, preco, estoque }: Readonly<LivroConsultaDTO>) {
    return (
        <Card className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white p-4 shadow-md transition-transform">
            <h2 className="text-lg font-semibold">{titulo}</h2>
            <p className="text-sm text-gray-600">Autor: {autor}</p>
            <p className="text-sm text-gray-600">Categoria: {categoria}</p>
            <p className="text-sm text-gray-600">Preço: R$ {preco}</p>
            {estoque > 0 ? (
                <Link href={`/catalogo/${id}`} className="text-sm text-blue-600 hover:underline">Ver detalhes</Link>
            ) : (
                <p className="text-sm text-red-600">Indisponível</p>
            )}
        </Card>
    );
}