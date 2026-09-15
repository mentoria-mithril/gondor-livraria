'use client';

import type { LivroResponse } from '@/types/livro.type';
import CardLivro from '@/components/catalogo/CardLivro';
import { listarLivros } from '@/services/api';
import { useEffect, useState } from 'react';
import FilterCatalogo  from '@/components/catalogo/FilterCatalogo';
import PaginationCatalogo from '@/components/catalogo/PaginationCatalogo';

const LIVROS_POR_PAGINA = 6;

export default function CatalogoPage() {
    const [livros, setLivros] = useState<LivroResponse>({value: [], count: 0});
    const [busca, setBusca] = useState('');
    const [categoria, setCategoria] = useState('');
    const [pagina, setPagina] = useState(1);
    const totalPaginas = Math.ceil(livros.count / LIVROS_POR_PAGINA);

    useEffect(() => {
        const fetchLivros = async () => {
            try {
                const livros = await listarLivros(busca, categoria, pagina);
                setLivros(livros);
            } catch (error) {
                console.error('Erro ao buscar livros:', error);
            }
        };

        fetchLivros();
    }, [busca, categoria, pagina]);

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const busca = formData.get('busca');
        const categoria = formData.get('categoria');
        
        setPagina(1);

        if (typeof busca === 'string') {
            setBusca(busca);
        }

        if (typeof categoria === 'string') {
            setCategoria(categoria);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2E9D8]">
            <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16 text-[#4A1F1F]">
                <header>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#A60321]">
                        Gondor Livraria
                    </h1>
                    <FilterCatalogo handleSubmit={handleSubmit} setBusca={setBusca} setCategoria={setCategoria} setPagina={setPagina} />
                </header>
                <main>
                    <h2 className="text-sm font-medium uppercase tracking-wide text-[#A60321]">
                        Catálogo de Livros
                    </h2>

                    {livros.count > 0 ? (
                        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {livros.value.map((livro) => (
                                <CardLivro
                                    key={livro.id}
                                    {...livro}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-[#6E4840]">
                            Nenhum livro encontrado.
                        </p>
                    )}

                    {totalPaginas > 1 && (
                        <PaginationCatalogo
                            pagina={pagina}
                            totalPaginas={totalPaginas}
                            setPagina={setPagina}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}