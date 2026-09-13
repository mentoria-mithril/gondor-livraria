import type {  LivroConsultaResponse, LivroConsultaDTO } from "../types/livro.type.js";
import { test } from 'node:test'
import assert from 'node:assert/strict'

test('serviço de livro retorna livros', async () => {
    
    const esperadoQuandoEncontrar: LivroConsultaResponse = {
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
    const esperadoQuandoNaoEncontrar: LivroConsultaResponse = {
        value: [],
        count: 0
    };

    const montarLivros = async (livros: LivroConsultaDTO[], quantidade: number): Promise<LivroConsultaResponse> => {
        return {
            value: livros,
            count: quantidade
        };
    };

    assert.deepEqual(await montarLivros(esperadoQuandoEncontrar.value, 2), esperadoQuandoEncontrar);
    assert.deepEqual(await montarLivros([], 0), esperadoQuandoNaoEncontrar);
});
