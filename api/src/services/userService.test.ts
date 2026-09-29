import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';
import { registerUser } from './userService.js';

const fakeUser = {
    id: 'uuid-fake',
    nome: 'Ana',
    email: 'ana@exemplo.com',
    dtCriacao: new Date('2026-01-01T00:00:00.000Z'),
};

test('Cadastro com email existente lança ErroDeDominio 409', async () => {
    await assert.rejects(
        () =>
            registerUser(
                { nome: 'Outra', email: 'ana@exemplo.com', senha: '123456' },
                {
                    findUserByEmail: async () => fakeUser,
                    createUserWithCart: async () => {
                        throw new Error('não deveria criar usuário');
                    },
                    hashPassword: async () => 'hash-qualquer',
                },
            ),
        (error: unknown) => {
            assert.ok(error instanceof ErroDeDominio);
            assert.equal(error.status, 409);
            assert.match(error.message, /email/i);
            return true;
        },
    );
});

test('Cadastro com email novo chama create e não expõe senha.', async () => {
    let hashCalled = false;
    const result = await registerUser(
        { nome: ' Ana ', email: ' NOVA@exemplo.com ', senha: '123456' },
        {
            findUserByEmail: async () => null,
            hashPassword: async (password) => {
                hashCalled = true;
                assert.equal(password, '123456');
                return '$2b$10$hashfake';
            },
            createUserWithCart: async (data) => {
                assert.equal(data.email, 'nova@exemplo.com');
                assert.equal(data.nome, 'Ana');
                assert.equal(data.senhaHash, '$2b$10$hashfake');
                return fakeUser;
            },
        },
    );
    assert.equal(hashCalled, true);
    assert.deepEqual(result, fakeUser);
    assert.ok(!('senha' in result));
});

