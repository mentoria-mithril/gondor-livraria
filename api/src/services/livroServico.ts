import { LivroConsulta, LivroConsultaResponse } from "../types/livro.type.js";
import { livroConsultaSchema } from "../schemas/livroSchema.js";
import { buscarLivrosPorFiltros, quantidadeTotalLivrosPorFiltros } from "../repositories/livroRepositorio.js";

export async function buscarLivros(filtros: LivroConsulta): Promise<LivroConsultaResponse> {

    const filtrosValidados = livroConsultaSchema.parse(filtros);

    const livrosResponse = await buscarLivrosPorFiltros({
        busca: filtrosValidados.busca,
        categoria: filtrosValidados.categoria,
        pagina: filtrosValidados.pagina
    });

    const quantidadeTotal = await quantidadeTotalLivrosPorFiltros({
        busca: filtrosValidados.busca,
        categoria: filtrosValidados.categoria
    });

    return {
        value: livrosResponse,
        count: quantidadeTotal
    };
}