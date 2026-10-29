import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';
import { login, usuarioDaSessao, DIAS_DE_SESSAO, type AuthDependencies } from './authService.js';

const agora = new Date('2026-10-28T12:00:00.000Z');

const usuario = {
    id: 'uuid-ana',
    nome: 'Ana',
    email: 'ana@exemplo.com',
    senha: 'hash-da-senha',
    dtCriacao: new Date('2026-01-01T00:00:00.000Z'),
};

function dependencias(sobrescrever: Partial<AuthDependencies> = {}) {
    const sessoesCriadas: { token: string; usuarioId: string; expiraEm: Date }[] = [];
    const deps = {
        findUserForAuthentication: async () => usuario,
        comparePassword: async () => true,
        criarSessao: async (dados: { token: string; usuarioId: string; expiraEm: Date }) => {
            sessoesCriadas.push(dados);
        },
        buscarSessao: async () => null,
        apagarSessao: async () => {},
        agora: () => agora,
        ...sobrescrever,
    };
    return { deps, sessoesCriadas };
}

function erro401(erro: unknown): boolean {
    assert.ok(erro instanceof ErroDeDominio);
    assert.equal(erro.status, 401);
    return true;
}

test('login certo cria a sessão e devolve o token sem a senha', async () => {
    const { deps, sessoesCriadas } = dependencias();

    const resultado = await login({ email: 'ana@exemplo.com', senha: '123456' }, deps);

    assert.equal(sessoesCriadas.length, 1);
    assert.equal(resultado.token, sessoesCriadas[0]?.token);
    assert.match(resultado.token, /^[0-9a-f]{64}$/);
    assert.equal(sessoesCriadas[0]?.usuarioId, 'uuid-ana');
    assert.equal(resultado.expiraEm.getTime() - agora.getTime(), DIAS_DE_SESSAO * 24 * 60 * 60 * 1000);
    assert.equal('senha' in resultado.usuario, false);
});

test('email inexistente e senha errada devolvem o mesmo 401', async () => {
    const semUsuario = dependencias({ findUserForAuthentication: async () => null }).deps;
    const senhaErrada = dependencias({ comparePassword: async () => false }).deps;

    const mensagens: string[] = [];
    for (const deps of [semUsuario, senhaErrada]) {
        await assert.rejects(() => login({ email: 'ana@exemplo.com', senha: 'errada' }, deps), (erro: unknown) => {
            erro401(erro);
            mensagens.push((erro as Error).message);
            return true;
        });
    }
    assert.equal(mensagens[0], mensagens[1]);
});

test('senha errada não cria sessão', async () => {
    const { deps, sessoesCriadas } = dependencias({ comparePassword: async () => false });

    await assert.rejects(() => login({ email: 'ana@exemplo.com', senha: 'errada' }, deps), erro401);
    assert.equal(sessoesCriadas.length, 0);
});

test('sessão válida devolve o dono', async () => {
    const { deps } = dependencias({
        buscarSessao: async () => ({ usuarioId: 'uuid-ana', expiraEm: new Date('2026-11-01T00:00:00.000Z') }),
    });

    assert.equal(await usuarioDaSessao('token-qualquer', deps), 'uuid-ana');
});

test('token que não existe e sessão expirada dão 401', async () => {
    const inexistente = dependencias().deps;
    const expirada = dependencias({
        buscarSessao: async () => ({ usuarioId: 'uuid-ana', expiraEm: new Date('2026-10-28T11:59:59.000Z') }),
    }).deps;

    await assert.rejects(() => usuarioDaSessao('nao-existe', inexistente), erro401);
    await assert.rejects(() => usuarioDaSessao('token-velho', expirada), erro401);
});
