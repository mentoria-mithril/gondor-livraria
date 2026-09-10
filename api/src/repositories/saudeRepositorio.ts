import { prisma } from './prisma.js'

/**
 * Pergunta mais barata possível ao banco. Serve para saber se a conexão está de
 * pé — não para medir desempenho.
 */
export async function bancoRespondendo(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
