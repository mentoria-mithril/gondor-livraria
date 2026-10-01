import {test} from 'node:test'
import assert from 'node:assert/strict'
import { ErroDeDominio } from '../errors/ErroDeDominio.js'
import { autenticarUsuario } from './authService.js'


const usuarioComSenhaFake = {
  id: 'uuid-fake',
  nome: 'Ana',
  email: 'ana@exemplo.com',
  senha: '$2b$10$hash-fake',
  dtCriacao: new Date('2026-01-01T00:00:00.000Z'),
}

test('login falha com 401 quando a senha está incorreta', async () => {
  await assert.rejects(
    () =>
      autenticarUsuario(
        { email: 'ana@exemplo.com', senha: 'senha-errada' },
        {
          buscarUsuarioParaAutenticacao: async () => usuarioComSenhaFake,
          compararSenha: async (senhaDigitada, senhaHash) => {
            assert.equal(senhaDigitada, 'senha-errada')
            assert.equal(senhaHash, '$2b$10$hash-fake')
            return false
          },
        },
      ),
    (erro: unknown) => {
      assert.ok(erro instanceof ErroDeDominio)
      assert.equal(erro.status, 401)
      return true
    },
  )
})

test('login válido retorna somente os dados públicos do usuário', async () => {
  const resultado = await autenticarUsuario(
    { email: ' ANA@EXEMPLO.COM ', senha: 'senha123' },
    {
      buscarUsuarioParaAutenticacao: async (email) => {
        assert.equal(email, 'ana@exemplo.com')
        return usuarioComSenhaFake
      },
      compararSenha: async (senhaDigitada, senhaHash) => {
        assert.equal(senhaDigitada, 'senha123')
        assert.equal(senhaHash, '$2b$10$hash-fake')
        return true
      },
    },
  )

  assert.deepEqual(resultado, {
    id: 'uuid-fake',
    nome: 'Ana',
    email: 'ana@exemplo.com',
    dtCriacao: new Date('2026-01-01T00:00:00.000Z'),
  })
  assert.ok(!('senha' in resultado))
})

test('autenticação de email falha se não existir', async () => {
    await assert.rejects(
      () =>
        autenticarUsuario(
          { email: 'usuario@exemplo.com', senha: 'senha123' },
          {
            buscarUsuarioParaAutenticacao: async () => null,
            compararSenha: async () => true,
          }
        ),
        (erro: unknown) => {
            assert.ok(erro instanceof ErroDeDominio)
            assert.equal(erro.status, 401)
            return true
        }
    )
})
