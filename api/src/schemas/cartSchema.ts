import {z} from 'zod';

export const AddItemBody = z.object({
    bookId: z.number().int().positive(),
    quantity: z.number().int().positive().default(1),
});

export type AddItemBody = z.infer<typeof AddItemBody>;

export const ItemIdParams = z.object({
    itemId: z.string().uuid(),
})

export const UpdateQuantityBody = z.object({
    quantity: z.number().int().positive(),
})

export const UserIdHeader = z.string().uuid()
