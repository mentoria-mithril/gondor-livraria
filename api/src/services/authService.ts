import { randomBytes } from 'node:crypto';
import { ErroDeDominio } from '../errors/ErroDeDominio.js';
import type { LoginInput } from '../schemas/authSchema.js';
import type { PublicUser } from '../repositories/userRepository.js';
import {
    findUserForAuthentication,
    criarSessao,
    buscarSessao,
    apagarSessao,
} from '../repositories/authRepository.js';
import { comparePassword } from './passwordService.js';

export const DIAS_DE_SESSAO = 7;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

export type Login = {
    token: string;
    expiraEm: Date;
    usuario: PublicUser;
};

export type AuthDependencies = {
    findUserForAuthentication: typeof findUserForAuthentication;
    comparePassword: typeof comparePassword;
    criarSessao: typeof criarSessao;
    buscarSessao: typeof buscarSessao;
    apagarSessao: typeof apagarSessao;
    agora: () => Date;
};

const defaultDependencies: AuthDependencies = {
    findUserForAuthentication,
    comparePassword,
    criarSessao,
    buscarSessao,
    apagarSessao,
    agora: () => new Date(),
};

// Mesma mensagem para email inexistente e senha errada: não revela quem tem conta.
const CREDENCIAIS_INVALIDAS = 'Email ou senha inválidos.';

export async function login(
    input: LoginInput,
    deps: AuthDependencies = defaultDependencies,
): Promise<Login> {
    const usuario = await deps.findUserForAuthentication(input.email);
    if (!usuario) {
        throw new ErroDeDominio(CREDENCIAIS_INVALIDAS, 401);
    }

    const senhaConfere = await deps.comparePassword(input.senha, usuario.senha);
    if (!senhaConfere) {
        throw new ErroDeDominio(CREDENCIAIS_INVALIDAS, 401);
    }

    const token = randomBytes(32).toString('hex');
    const expiraEm = new Date(deps.agora().getTime() + DIAS_DE_SESSAO * MS_POR_DIA);
    await deps.criarSessao({ token, usuarioId: usuario.id, expiraEm });

    const publico: PublicUser = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        dtCriacao: usuario.dtCriacao,
    };
    return { token, expiraEm, usuario: publico };
}

export async function usuarioDaSessao(
    token: string,
    deps: AuthDependencies = defaultDependencies,
): Promise<string> {
    const sessao = await deps.buscarSessao(token);
    if (!sessao || sessao.expiraEm <= deps.agora()) {
        throw new ErroDeDominio('Sessão inválida ou expirada.', 401);
    }
    return sessao.usuarioId;
}

export async function logout(
    token: string,
    deps: AuthDependencies = defaultDependencies,
): Promise<void> {
    await deps.apagarSessao(token);
}
