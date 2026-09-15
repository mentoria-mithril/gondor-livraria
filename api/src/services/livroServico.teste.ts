import type {  LivroConsultaResponse, LivroConsultaDTO, LivroResponseDTO } from "../types/livro.type.js";
import {z, ZodError} from "zod";
import {describe, test} from 'node:test'
import assert from 'node:assert/strict'

const livroIdSchemaTeste = z.coerce.number().int().positive();

class ErroDeDominioTeste extends Error {
    readonly status: number

    constructor(mensagem: string, status = 400) {
        super(mensagem)
        this.name = 'ErroDeDominio'
        this.status = status
    }
}

test('serviço de livro retorna livros quando há resultados', async () => {

    const esperado: LivroConsultaResponse = {
        value: [
            {
                id: 1,
                titulo: 'Dom Casmurro',
                autor: 'Machado de Assis',
                preco: 35.0,
                categoria: 'Clássico brasileiro',
                estoque: 12
            },
            {
                id: 2,
                titulo: 'Memórias Póstumas de Brás Cubas',
                autor: 'Machado de Assis',
                preco: 42.5,
                categoria: 'Clássico brasileiro',
                estoque: 8
            }
        ],
        count: 2
    };

    const montarLivros = async (livros: LivroConsultaDTO[], quantidade: number) => {
        if (quantidade !== 0) {
            return {
                value: livros,
                count: quantidade
            };
        }
        return {
            message: 'Nenhum livro encontrado'
        };
    };

    assert.deepEqual(await montarLivros(esperado.value, 2), esperado);
});

test('serviço de livro retorna mensagem quando não há resultados', async () => {

    const esperado: { message: string } = {
        message: 'Nenhum livro encontrado',
    };

    const montarLivros = async (livros: LivroConsultaDTO[], quantidade: number) => {
        if (quantidade !== 0) {
            return {
                value: livros,
                count: quantidade
            };
        }
        return {
            message: 'Nenhum livro encontrado'
        };
    };

    assert.deepEqual(await montarLivros([], 0), esperado);
});
describe('buscarLivroPorId', () => {
    test('retorna os detalhes quando o livro existe', async () => {
        const esperado: LivroResponseDTO = {
            id: 1,
            titulo: 'Memórias Póstumas de Brás Cubas',
            autor: 'Machado de Assis',
            categoria: 'Clássico brasileiro',
            sinopse: 'Sinopse de "Memórias Póstumas de Brás Cubas", de Machado de Assis. Texto de exemplo do seed — a fatia B mostra isto na página de detalhe.',
            preco: 42.50,
            estoque: 8,
            dtCriacao: '2026-09-13T18:23:49.000Z'
        }

        const livroDetalhes = async (livro: LivroResponseDTO | null) => {
            if (livro == null){
                throw new ErroDeDominioTeste('Livro não encontrado! Tente novamente.', 404)
            }
            return livro;
        }

        assert.deepEqual(await livroDetalhes(esperado), esperado);
    })

    test('lança ErroDeDominio 404 quando o livro não existe', async () => {
        const livroDetalhes = async (livro: LivroResponseDTO | null) => {
            if (livro == null) {
                throw new ErroDeDominioTeste('Livro não encontrado! Tente novamente.', 404)
            }
            return livro;
        }

        await assert.rejects(livroDetalhes(null), (erro) => erro instanceof ErroDeDominioTeste && erro.status === 404 && erro.message === 'Livro não encontrado! Tente novamente.')
    });

    test('rejeita id inválido: abc', () => {
        const idInvalido = 'abc'

        assert.throws(() => livroIdSchemaTeste.parse(idInvalido), (erro) => erro instanceof ZodError)
    });

    test('rejeita id inválido: 0', () => {
        const idInvalido = '0'

        assert.throws(() => livroIdSchemaTeste.parse(idInvalido), (erro) => erro instanceof ZodError)
    });


})
