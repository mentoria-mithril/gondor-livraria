import { z } from "zod";

export const livroConsultaSchema = z.object({
    busca: z.string().min(1).optional(),
    categoria: z.string().min(1).optional(),
    pagina: z.number().int().min(1).default(1)
});