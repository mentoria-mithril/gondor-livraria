import { z } from 'zod';

export const CreateOrderBody = z.object({
    total: z.number().optional(),
});

export type CreateOrderBody = z.infer<typeof CreateOrderBody>;
