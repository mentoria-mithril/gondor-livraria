import { PrismaClient } from '@prisma/client'

/**
 * O ÚNICO lugar do projeto que instancia o Prisma. Serviço não importa daqui —
 * importa de um repositório.
 *
 * Quando uma listagem ficar lenta, troque `log` por ['query'] e leia o SQL que
 * o Prisma gerou. Saber o que o ORM fez por você é parte do que é avaliado.
 */
export const prisma = new PrismaClient({
  log: ['warn', 'error'],
})
