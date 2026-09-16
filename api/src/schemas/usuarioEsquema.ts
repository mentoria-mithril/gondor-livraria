import { z } from "zod";

export const cadastroUsuarioEsquema = z.object({
    nome: z.string().trim().min(1, 'Informe o nome.'),
    email: z.string().trim().email('Email invalido.'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
})

export type CadastroUsuarioEntrada = z.infer<typeof cadastroUsuarioEsquema>; // z.infer gera o tipo TS alinhado ao esquema -- serviço e controlador usam o mesmo contrato. -> Garante que o contrato seja seguido.

export const loginUsuarioEsquema = z.object({
    email: z.string().trim().email('Email invalido.'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
})

export type loginUsuarioEntrada = z.infer<typeof loginUsuarioEsquema>;
