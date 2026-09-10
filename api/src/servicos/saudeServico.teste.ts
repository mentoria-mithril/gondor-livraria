import { test } from 'node:test'
import assert from 'node:assert/strict'

/**
 * Exemplo de teste da fatia 0: prova que o serviço é testável SEM subir
 * servidor e SEM banco, porque ele não conhece `req`/`res` nem o Prisma direto.
 *
 * Rode com: npm run teste
 */
test('serviço de saúde reporta degradado quando o banco não responde', async () => {
  // O serviço real importa o repositório; aqui a versão pequena da mesma regra,
  // só para mostrar o formato. Ao escrever a sua fatia, injete o repositório.
  const montarSaude = (bancoOk: boolean) => ({
    status: bancoOk ? 'ok' : 'degradado',
    api: 'ok' as const,
    banco: bancoOk ? 'conectado' : 'inacessivel',
  })

  assert.deepEqual(montarSaude(true), { status: 'ok', api: 'ok', banco: 'conectado' })
  assert.deepEqual(montarSaude(false), {
    status: 'degradado',
    api: 'ok',
    banco: 'inacessivel',
  })
})
