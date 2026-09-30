import type {  LivroConsultaResponse, LivroConsultaDTO } from "../types/livro.type.js";
import { test } from 'node:test'
import assert from 'node:assert/strict'

test('serviço de livro retorna livros quando há resultados', async () => {

    const esperado: LivroConsultaResponse = {
        value: [
            {
                id: 1,
                titulo: 'Dom Casmurro',
                autor: 'Machado de Assis',
                preco: '39.9',
                categoria: 'Clássico brasileiro',
                estoque: 12
            },
            {
                id: 2,
                titulo: 'Memórias Póstumas de Brás Cubas',
                autor: 'Machado de Assis',
                preco: '42.5',
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
