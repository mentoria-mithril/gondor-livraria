import { ErroDeDominio } from "../errors/ErroDeDominio.js";
import type { loginUsuarioEntrada } from "../schemas/usuarioEsquema.js";
import type { UsuarioPublico } from "../repositories/usuarioRepositorio.js";
import { buscarUsuarioParaAutenticacao } from "../repositories/authRepositorio.js";
import {compararSenha} from './senhaServico.js';
import { Prisma } from "@prisma/client";

type DependenciasLogin = {
    buscarUsuarioParaAutenticacao: typeof buscarUsuarioParaAutenticacao
    compararSenha: typeof compararSenha
}

const dependencias: DependenciasLogin ={
    buscarUsuarioParaAutenticacao,
    compararSenha,
}

function normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
}

export async function autenticarUsuario(
    entrada: loginUsuarioEntrada,
    deps: DependenciasLogin = dependencias
): Promise<UsuarioPublico> {
    const email = normalizarEmail(entrada.email)
    const usuario = await deps.buscarUsuarioParaAutenticacao(email);
    if(!usuario){
        throw new ErroDeDominio('Email ou senhas invalidos', 401)
    }

    const senhaCorreta = await deps.compararSenha(
        entrada.senha,
        usuario.senha,
    );

    if(!senhaCorreta){
        throw new ErroDeDominio('email ou senhas invalidos', 401)
    }

    return{
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        dtCriacao: usuario.dtCriacao
    }
}
