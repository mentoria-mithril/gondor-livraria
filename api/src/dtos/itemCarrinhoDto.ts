import {z} from 'zod';

export const AdicionarItemCarrinhoDto = z.object({
    livroId: z.number().int().positive(),
    quantidade: z.number().int().positive().default(1),
});

export type AdicionarItemCarrinhoDto = z.infer<typeof AdicionarItemCarrinhoDto>;