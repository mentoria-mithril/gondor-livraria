import { z } from 'zod';

export const registerUserSchema = z.object({
    nome: z.string().trim().min(1, 'Informe o nome.'),
    email: z.string().trim().email('Email invalido.'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

