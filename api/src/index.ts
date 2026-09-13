import { criarServidor } from './servidor.js'
import { prisma } from './repositories/prisma.js'

const PORTA = Number(process.env.PORT) || 3333

const servidor = criarServidor().listen(PORTA, () => {
  console.log(`API de pé em http://localhost:${PORTA}`)
  console.log(`Saúde:      http://localhost:${PORTA}/api/saude`)
})

// Sem isto o container morre no `docker stop` derrubando conexões no meio.
for (const sinal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sinal, () => {
    console.log(`\n${sinal} recebido, encerrando...`)
    servidor.close(() => {
      void prisma.$disconnect().then(() => process.exit(0))
    })
  })
}
