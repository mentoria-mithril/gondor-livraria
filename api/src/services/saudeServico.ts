import { bancoRespondendo } from '../repositories/saudeRepositorio.js'

export type Saude = {
  status: 'ok' | 'degradado'
  api: 'ok'
  banco: 'conectado' | 'inacessivel'
}

/**
 * Um healthcheck que só responde "estou vivo" não serve para nada: o processo
 * pode estar de pé e incapaz de atender qualquer requisição. Ele precisa checar
 * a dependência real.
 */
export async function verificarSaude(): Promise<Saude> {
  const banco = await bancoRespondendo()

  return {
    status: banco ? 'ok' : 'degradado',
    api: 'ok',
    banco: banco ? 'conectado' : 'inacessivel',
  }
}
