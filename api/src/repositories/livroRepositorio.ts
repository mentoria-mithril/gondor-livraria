import { prisma } from "./prisma.js";
import { LivroConsulta, LivroConsultaQuantidade, LivroConsultaDTO } from "../types/livro.type.js";

export function buscarLivrosPorFiltros({busca, categoria, pagina }: LivroConsulta): Promise<LivroConsultaDTO[]> {
    return prisma.livro.findMany({
        select: {
            id: true,
            titulo: true,
            autor: true,
            preco: true,
            categoria: true,
            estoque: true
        },
        where: {
            ...(busca != null && busca !== "" && {
                OR: [
                    {
                        autor: {
                            contains: busca,
                            mode: "insensitive"
                        }
                    },
                    {
                        titulo: {
                            contains: busca,
                            mode: "insensitive"
                        }
                    }
                ]
            }),
            ...(categoria != null && categoria !== "" && {
                categoria: {
                    contains: categoria,
                    mode: "insensitive"
                }
            })
        },
        skip: (pagina - 1) * 6,
        take: 6,
    }).then((livros) => livros.map((livro) => ({
        ...livro,
        preco: livro.preco.toString(),
    })));
}

export function quantidadeTotalLivrosPorFiltros({ busca, categoria }: LivroConsultaQuantidade): Promise<number> {
    return prisma.livro.count({
        where: {
            ...(busca != null && busca !== "" && {
                OR: [
                    {
                        autor: {
                            contains: busca,
                            mode: "insensitive"
                        }
                    },
                    {
                        titulo: {
                            contains: busca,
                            mode: "insensitive"
                        }
                    }
                ]
            }),

            ...(categoria != null && categoria !== "" && {
                categoria: {
                    contains: categoria,
                    mode: "insensitive"
                }
            })
        }
    });
}
