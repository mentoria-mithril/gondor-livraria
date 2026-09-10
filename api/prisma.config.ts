/**
 * Configuração do Prisma. A partir da versão 6.19 é aqui, e não mais no bloco
 * `"prisma"` do package.json (que sai na 7).
 */
import 'dotenv/config'
import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    // É isto que faz o `prisma migrate reset` repopular o catálogo sozinho.
    seed: 'tsx prisma/seed.ts',
  },
})
