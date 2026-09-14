'use client';

import type { LivroResponse } from '@/types/livro.type';
import CardLivro from '@/components/catalogo/CardLivro';
import { listarLivros } from '@/services/api';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

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
                <nav>
                    <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
                        <Input
                            className="border-[#D9A577] bg-[#D9A577]/30 text-[#4A1F1F] placeholder:text-[#6E4840] focus-visible:border-[#A60321] focus-visible:ring-[#A60321]/30"
                            name='busca'
                            placeholder='Buscar...'
                        />
                        <Input
                            className="border-[#D9A577] bg-[#D9A577]/30 text-[#4A1F1F] placeholder:text-[#6E4840] focus-visible:border-[#A60321] focus-visible:ring-[#A60321]/30"
                            name='categoria'
                            placeholder='Buscar por Categoria...'
                        />
                        <Button className="bg-[#A60321] text-[#F2E9D8] hover:bg-[#87021B]" type='submit'>Buscar</Button>
                    </form>
                </nav>
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
                    <Pagination className="mt-6">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    text="Anterior"
                                    className="text-[#A60321] hover:bg-[#D9A577]/40 hover:text-[#A60321]"
                                    aria-disabled={pagina === 1}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        if (pagina > 1) setPagina(pagina - 1);
                                    }}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPaginas }, (_, index) => {
                                const numeroPagina = index + 1;

                                return (
                                    <PaginationItem key={numeroPagina}>
                                        <PaginationLink
                                            href="#"
                                            isActive={numeroPagina === pagina}
                                            className="text-[#A60321] hover:bg-[#D9A577]/40 hover:text-[#A60321] data-[active=true]:border-[#A60321] data-[active=true]:bg-[#A60321] data-[active=true]:text-[#F2E9D8]"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setPagina(numeroPagina);
                                            }}
                                        >
                                            {numeroPagina}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    text="Próxima"
                                    className="text-[#A60321] hover:bg-[#D9A577]/40 hover:text-[#A60321]"
                                    aria-disabled={pagina === totalPaginas}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        if (pagina < totalPaginas) setPagina(pagina + 1);
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
                </main>
            </div>
        </div>
    );
}