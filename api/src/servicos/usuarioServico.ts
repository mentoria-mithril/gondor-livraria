import { ErroDeDominio } from "../erros/ErroDeDominio.js";
import type { CadastroUsuarioEntrada } from "../esquemas/usuarioEsquema.js";
import { 
    buscarUsuarioPorEmail,
    criarUsuarioComCarrinho,
    type UsuarioPublico,
 } from "../repositorios/usuarioRepositorio.js";
import { hashSenha } from './senhaServico.js';
import { Prisma } from '@prisma/client'

type DependenciasCadastro = {
    buscarUsuarioPorEmail: typeof buscarUsuarioPorEmail
    criarUsuarioComCarrinho: typeof criarUsuarioComCarrinho
    hashSenha: typeof hashSenha
}

const dependenciasPadrao: DependenciasCadastro = {
    buscarUsuarioPorEmail,
    criarUsuarioComCarrinho,
    hashSenha,
}

function normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
}

function conflitoDeEmailUnico(erro: unknown): boolean {
    return (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        erro.code === 'P2002'
    );
}

export async function cadastrarUsuario(
    entrada: CadastroUsuarioEntrada,
    deps: DependenciasCadastro = dependenciasPadrao
): Promise<UsuarioPublico> {
    const email = normalizarEmail(entrada.email);

    const existente = await deps.buscarUsuarioPorEmail(email);
    if (existente) {
        throw new ErroDeDominio('Email já cadastrado.', 409);
    }

    const senhaHash = await deps.hashSenha(entrada.senha);

    try {
        return await deps.criarUsuarioComCarrinho({
            nome: entrada.nome.trim(),
            email,
            senhaHash,
        });
    } catch (erro) {
        if (conflitoDeEmailUnico(erro)) {
            throw new ErroDeDominio('Email já cadastrado.', 409);
        }
        throw erro;
    }
}