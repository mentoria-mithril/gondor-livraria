import { test } from 'node:test'
import assert from 'node:assert/strict'
import { verificarSaude } from './saudeServico.js'

/**
 * Exemplo de teste da fatia 0: prova que o serviço é testável SEM subir
 * servidor e SEM banco, porque ele não conhece `req`/`res` nem o Prisma direto.
 *
 * O teste importa o serviço de verdade e troca só o repositório, passando uma
 * função falsa no lugar dele. Faça o mesmo na sua fatia: se o teste copia a
 * função para dentro dele, continua verde mesmo quando o código real quebra.
 *
 * Rode com: npm run teste
 */
test('serviço de saúde reporta ok quando o banco responde', async () => {
  const saude = await verificarSaude(async () => true)

  assert.deepEqual(saude, { status: 'ok', api: 'ok', banco: 'conectado' })
})

test('serviço de saúde reporta degradado quando o banco não responde', async () => {
  const saude = await verificarSaude(async () => false)

  assert.deepEqual(saude, { status: 'degradado', api: 'ok', banco: 'inacessivel' })
})
