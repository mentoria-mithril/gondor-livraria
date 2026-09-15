import {LivroConsulta, LivroConsultaResponse, LivroResponseDTO} from "../types/livro.type.js";
import { livroConsultaSchema, livroIdSchema } from "../schemas/livroSchema.js";
import {
    buscarLivroPorId,
    buscarLivrosPorFiltros,
    quantidadeTotalLivrosPorFiltros
} from "../repositories/livroRepositorio.js";
import {ErroDeDominio} from "../errors/ErroDeDominio.js";

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

export async function buscarLivro(id: unknown): Promise<LivroResponseDTO> {
    const idValidado = livroIdSchema.parse(id);
    const livro = await buscarLivroPorId(idValidado)
    if (!livro) {
        throw new ErroDeDominio('Livro não encontrado! Tente novamente.', 404)
    }
    return livro;
}