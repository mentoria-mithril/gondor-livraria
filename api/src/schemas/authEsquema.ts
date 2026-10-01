import { z } from "zod";

export const loginUsuarioEsquema = z.object({
    email: z.string().trim().email('Email invalido.'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
})

export type loginUsuarioEntrada = z.infer<typeof loginUsuarioEsquema>;