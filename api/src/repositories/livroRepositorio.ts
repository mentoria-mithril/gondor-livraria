import { prisma } from "./prisma.js";
import type { LivroConsulta, LivroConsultaQuantidade, LivroConsultaDTO } from "../types/livro.type.js";

export async function buscarLivrosPorFiltros({ busca, categoria, pagina }: LivroConsulta): Promise<LivroConsultaDTO[]> {
    const buscaParam = busca?.trim() || null;
    const categoriaParam = categoria?.trim() || null;

    const livros = await prisma.$queryRaw<LivroConsultaDTO[]>`
        SELECT
            l.id,
            l.titulo,
            l.autor,
            CAST(l.preco AS DECIMAL(10, 2)) AS preco,
            l.categoria,
            l.estoque
        FROM livro l
        WHERE
            (
                CAST(${buscaParam} AS TEXT) IS NULL
                OR unaccent(l.titulo) ILIKE unaccent('%' || ${buscaParam} || '%')
                OR unaccent(l.autor) ILIKE unaccent('%' || ${buscaParam} || '%')
            )
            AND
            (
                CAST(${categoriaParam} AS TEXT) IS NULL
                OR unaccent(l.categoria) ILIKE unaccent('%' || ${categoriaParam} || '%')
            )
        ORDER BY l.id
        LIMIT 6
        OFFSET ${(pagina - 1) * 6};
    `;
    return livros.map((livro) => ({
        ...livro,
        preco: Number(livro.preco),
    }));
}

export async function quantidadeTotalLivrosPorFiltros({ busca, categoria }: LivroConsultaQuantidade): Promise<number> {

    const buscaParam = busca?.trim() || null;
    const categoriaParam = categoria?.trim() || null;

    const response = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) AS count
        FROM livro l
        WHERE
            (
                CAST(${buscaParam} AS TEXT) IS NULL
                OR unaccent(l.titulo) ILIKE unaccent('%' || ${buscaParam} || '%')
                OR unaccent(l.autor) ILIKE unaccent('%' || ${buscaParam} || '%')
            )
            AND
            (
                CAST(${categoriaParam} AS TEXT) IS NULL
                OR unaccent(l.categoria) ILIKE unaccent('%' || ${categoriaParam} || '%')
            );
    `;

    return Number(response[0]?.count ?? 0);
}
