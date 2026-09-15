import {z} from 'zod';

export const AdicionarItemCarrinhoDto = z.object({
    livroId: z.number().int().positive(),
    quantidade: z.number().int().positive().default(1),
});

export type AdicionarItemCarrinhoDto = z.infer<typeof AdicionarItemCarrinhoDto>;

export const RemoverItemCarrinhoDto = z.object({
    livroId: z.coerce.number().int().positive(),
})

export type RemoverItemCarrinhoDto = z.infer<typeof RemoverItemCarrinhoDto>