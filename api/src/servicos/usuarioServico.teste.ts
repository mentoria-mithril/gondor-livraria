import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ErroDeDominio } from '../erros/ErroDeDominio.js';
import { cadastrarUsuario } from './usuarioServico.js';

const usuarioFake = {
    id: 'uuid-fake',
    nome: 'Ana',
    email: 'ana@exemplo.com',
    dtCriacao: new Date('2026-01-01T00:00:00.000Z'),
}

test('cadastro com email já existente lança ErroDeDominio 409', async () => {
    await assert.rejects(
      () =>
        cadastrarUsuario(
          { nome: 'Outra', email: 'ana@exemplo.com', senha: '123456' },
          {
            buscarUsuarioPorEmail: async () => usuarioFake,
            criarUsuarioComCarrinho: async () => {
              throw new Error('não deveria criar usuário')
            },
            hashSenha: async () => 'hash-qualquer',
          },
        ),
      (erro: unknown) => {
        assert.ok(erro instanceof ErroDeDominio)
        assert.equal(erro.status, 409)
        assert.match(erro.message, /email/i)
        return true
      },
    )
  })

  test('cadastro com email novo chama criar e não expõe senha no retorno', async () => {
    let hashChamado = false
    const resultado = await cadastrarUsuario(
      { nome: ' Ana ', email: ' NOVA@exemplo.com ', senha: '123456' },
      {
        buscarUsuarioPorEmail: async () => null,
        hashSenha: async (senha) => {
          hashChamado = true
          assert.equal(senha, '123456')
          return '$2b$10$hashfake'
        },
        criarUsuarioComCarrinho: async (dados) => {
          assert.equal(dados.email, 'nova@exemplo.com')
          assert.equal(dados.nome, 'Ana')
          assert.equal(dados.senhaHash, '$2b$10$hashfake')
          return usuarioFake
        },
      },
    )
    assert.equal(hashChamado, true)
    assert.deepEqual(resultado, usuarioFake)
    assert.ok(!('senha' in resultado))
  })