'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { obterLivroDetalhe} from "@/services/api";
import type { LivroDetalheDTO } from "@/types/livro.type";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import HeroSection from "@/components/catalogo/HeroSection";
import Sinopse from "@/components/catalogo/Sinopse";
import {Card} from "@/components/ui/card";


export default function LivroDetalhePage() {
    const { id } = useParams<{ id: string }>();
    const [livro, setLivro] = useState<LivroDetalheDTO | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState< Error | null>(null);

    useEffect(() => {
        async function buscarLivro(){
            setCarregando(true);
            setErro(null);
            try{
                const dadosLivro = await obterLivroDetalhe(id);
                setLivro(dadosLivro);
            } catch(error) {
                setErro(error instanceof Error ? error : new Error('Falha ao carregar o livro.'));
            } finally {
                setCarregando(false);
            }
        }
        void buscarLivro();
    }, [id]);

    if (carregando) return <p>Carregando...</p>;
    if (erro) return <p>{erro.message}</p>;
    if (!livro) return null;

    return (
        <div className="min-h-screen bg-[#F2E9D8]">
            <Card className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16 text-[#4A1F1F]">
                <Link href="/catalogo" className="flex w-fit items-center gap-2 hover:underline"><ArrowLeft className='h-4 w-4'/>voltar</Link>
                <HeroSection titulo={livro.titulo} autor={livro.autor} categoria={livro.categoria}/>
                <Sinopse sinopse={livro.sinopse}/>
            </Card>
        </div>
    );
}
