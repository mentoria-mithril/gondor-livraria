# Livraria — turma Gondor

Uma **loja de livros online**: o cliente procura um título, coloca no carrinho, fecha o
pedido e acompanha o que comprou. É o projeto que a turma toca durante o ciclo, em cima
do que já foi visto em aula — a engine de carrinho do encontro 01 e a containerização do
encontro 05 entram aqui, agora dentro de um produto de verdade.

O quadro da turma: <https://github.com/orgs/mentoria-mithril/projects/5>

> **O esqueleto já está de pé.** Banco, API e front sobem com os comandos abaixo, e
> `GET /api/saude` atravessa as quatro camadas de exemplo. A dificuldade deste projeto é
> modelagem, regra de negócio e trabalho em time — não `tsconfig`. O que está escrito
> aqui é o **escopo acordado**: o que o produto faz, quais são as entidades e quem
> entrega o quê. Antes de abrir um card, volte a este arquivo.

---

## O produto

Quatro coisas, nesta ordem de importância:

1. **Achar um livro.** Catálogo com busca por título e autor, filtro por categoria,
   e uma página de detalhe com sinopse, preço e estoque.
2. **Montar o carrinho.** Adicionar, mudar quantidade, remover. O carrinho junta linhas
   repetidas do mesmo livro somando a quantidade — é a regra do desafio do encontro 01,
   agora persistida.
3. **Fechar o pedido.** Um checkout que confere o estoque, congela o preço no momento
   da compra, baixa o estoque e devolve um número de pedido.
4. **Ter conta.** Cadastro e login. Carrinho e pedidos pertencem a alguém.

### O que está fora do escopo

Dizer o que **não** entra é parte do escopo. Nada disto será cobrado:

- Pagamento de verdade. O checkout tem um passo de pagamento **simulado**, que aprova ou
  recusa por uma regra combinada. Não integre gateway, não peça número de cartão.
- Frete calculado por transportadora, cupom, avaliação de cliente, recomendação.
- Painel de administração. Livro e estoque entram por *seed* no banco.

Se a dupla achar que algo aqui deveria entrar, o caminho é abrir uma issue argumentando —
não é começar a fazer.

---

## Stack

O que a turma já usou nos encontros, sem novidade só por novidade:

| Camada | Escolha |
| --- | --- |
| API | Node 22+, Express e TypeScript |
| Banco | PostgreSQL, acessado pelo **Prisma** (schema, migrações e client tipado) |
| Ambiente | Docker Compose sobe o banco; a API roda em container a partir da sprint de infra |
| Testes | `node:test` — o runner nativo, o mesmo do kata de TDD |
| Front | Next.js 16 (App Router) com React 19, TypeScript e Tailwind |

O Prisma dá o schema num arquivo só, migração versionada e client gerado — mas ele não
dispensa entender a consulta. Quando uma listagem ficar lenta, ligue
`log: ['query']` no client e **leia o SQL que ele gerou**. Saber o que o ORM fez por você
é parte do que está sendo avaliado.

---

## Rodando na sua máquina

Precisa de **Node 22+** e **Docker**.

```bash
# 1. banco
docker compose up -d

# 2. API (primeiro terminal)
cd api
cp .env.example .env
npm install
npm run banco:migrar     # cria as tabelas
npm run seed             # popula o catálogo
npm run dev              # http://localhost:3333

# 3. front (segundo terminal)
cd web
cp .env.example .env.local
npm install
npm run dev              # http://localhost:3000
```

Abra <http://localhost:3000>. Se aparecer **"API ok · banco ok"** em verde, está tudo
conectado e você pode pegar a sua fatia.

> O Postgres é publicado na porta **5433** (e não 5432) para não brigar com um Postgres
> que você já tenha instalado.

Comandos úteis:

| Comando | Onde | O que faz |
| --- | --- | --- |
| `npm run checar` | `api/` e `web/` | erros de tipo, sem compilar |
| `npm run teste` | `api/` | roda os testes (`node:test`, sem framework) |
| `npm run banco:studio` | `api/` | abre o Prisma Studio para ver os dados |
| `npm run banco:migrar` | `api/` | aplica mudanças do `schema.prisma` no banco |
| `docker compose down -v` | raiz | apaga o banco e recomeça do zero |

### Quando algo não sobe

| Sintoma | O que é |
| --- | --- |
| `EADDRINUSE :::3000` | já tem coisa na 3000. `npm run dev -- -p 3001` e ajuste a `NEXT_PUBLIC_API_URL` se precisar |
| `Environment variable not found: DATABASE_URL` | faltou o `cp .env.example .env` dentro de `api/` |
| `Can't reach database server at localhost:5433` | o container não está de pé: `docker compose up -d` |
| A tela mostra "API fora do ar" | o `npm run dev` da `api/` não está rodando |

---

## O modelo de dados

Seis modelos no `api/prisma/schema.prisma`. É o suficiente para a loja inteira:

| Tabela | Campos que importam |
| --- | --- |
| `usuario` | id, nome, email (único), senha (hash), dt_criacao |
| `livro` | id, titulo, autor, categoria, sinopse, preco, estoque, dt_criacao |
| `carrinho` | id, usuario_id (FK), dt_atualizacao |
| `item_carrinho` | id, carrinho_id (FK), livro_id (FK), quantidade — **`@@unique([carrinho_id, livro_id])`** |
| `pedido` | id, usuario_id (FK), status, valor_total, dt_criacao |
| `item_pedido` | id, pedido_id (FK), livro_id (FK), quantidade, **preco_unitario** |

Duas decisões que vão aparecer em review, então já ficam escritas:

- **`item_pedido.preco_unitario` existe de propósito.** O preço do pedido é o preço do dia
  da compra. Se o `livro.preco` mudar amanhã, o pedido de ontem não pode mudar junto —
  quem lê o preço do pedido pela tabela `livro` vai receber comentário no PR.
- **A unicidade de `(carrinho_id, livro_id)` é do banco, não do código.** É o
  `@@unique` no schema que impede duas linhas do mesmo livro no mesmo carrinho mesmo com
  duas requisições concorrentes — um `findFirst` antes do `create` não impede.
- **Fechar pedido é uma transação.** Conferir estoque, criar o pedido, criar os itens e
  baixar o estoque acontecem dentro de um `prisma.$transaction`. Meio pedido gravado é
  pior que pedido nenhum.

**Decisão em aberto para a turma:** o carrinho exige login, ou existe carrinho anônimo que
migra no login? As duas respostas se defendem. Decidam na sprint 1 e escrevam o porquê na
issue — a resposta muda a fatia A e a fatia C.

---

## Os endpoints

O contrato combinado. Mudança aqui passa por conversa, não por commit:

```
POST   /api/usuarios              cadastro
POST   /api/auth                  login

GET    /api/livros                lista, com ?busca=, ?categoria=, ?pagina=
GET    /api/livros/:id            detalhe

GET    /api/carrinho              o carrinho do usuário logado
POST   /api/carrinho/itens        adiciona um livro (soma se já estiver lá)
PATCH  /api/carrinho/itens/:id    muda a quantidade
DELETE /api/carrinho/itens/:id    remove

POST   /api/pedidos               fecha o carrinho e vira pedido
GET    /api/pedidos               os pedidos do usuário logado
GET    /api/pedidos/:id           detalhe do pedido

GET    /api/saude                 API e banco de pé
```

---

## Como o código se organiza

```
api/src/
├── routes/          só diz qual URL chama qual controlador
├── controllers/     entrada e saída de HTTP. Sem regra de negócio.
├── services/        ← a regra de negócio mora aqui
├── repositories/    único lugar que importa o Prisma
├── schemas/         validação da entrada
├── middlewares/     autenticação e tratamento de erro
└── errors/          ErroDeDominio: erro esperado, não é bug

web/src/
├── services/        chamadas à API — nada de `fetch` espalhado nas telas
├── components/      pedaços reaproveitáveis de tela
└── app/             uma pasta por rota (App Router do Next)
```

> **Pasta em inglês, código em português.** Os diretórios seguem a convenção que você
> vai encontrar em qualquer projeto Node (`routes`, `controllers`, `services`); o que está
> dentro deles — função, variável, comentário, commit — continua em português.

**`GET /api/saude` é o exemplo completo do caminho**: rota → controlador → serviço →
repositório → banco, e a tela consumindo. Ele existe para ser copiado. Leia esses cinco
arquivos antes de escrever o seu primeiro.

Três regras que valem em review:

1. **Controlador não decide nada.** `if` de regra de negócio no controlador tem lugar
   certo: o serviço.
2. **Serviço não conhece `req` nem `res`.** Recebe dado, devolve dado. É isso que deixa
   ele testável sem subir servidor.
3. **Só repositório importa `prisma`.** É isso que deixa o serviço testável sem subir
   banco. `prisma.livro.findMany` dentro de um serviço volta no review.

Erro esperado — livro sem estoque, email já cadastrado — é
`throw new ErroDeDominio("...", 409)`, e o middleware transforma em resposta HTTP.
Não encha o controlador de `try/catch`.

E uma pegadinha do Express que custa uma tarde: **handler `async` sempre dentro de
`envolver()`**. Sem isso, uma promessa rejeitada não chega no tratador de erros e a
requisição fica pendurada até dar timeout — o cliente não recebe nem `500`. O porquê
está comentado em `api/src/middlewares/envolver.ts`.

---

## As fatias

Cada dupla pega uma **fatia vertical completa** — tabela, repositório, serviço, rota e
tela. Ninguém é "o do backend". É assim que duas duplas quase nunca encostam no mesmo
arquivo e o merge para de doer.

| Fatia | O que entrega |
| --- | --- |
| **0 — Esqueleto** | Sprint 1, a turma inteira junto: `docker compose` com o Postgres, projeto da API de pé, `schema.prisma` com os seis modelos, primeira migração, `GET /api/saude` e o *seed* do catálogo. É o exemplo que as outras fatias copiam. |
| **A — Conta** | `POST /api/usuarios`, `POST /api/auth`, hash de senha, middleware de autenticação, telas de cadastro e login |
| **B — Catálogo** | `GET /api/livros` com busca, filtro e paginação, `GET /api/livros/:id`, listagem e página de detalhe |
| **C — Carrinho** | as quatro rotas de `/api/carrinho`, a regra de juntar linhas repetidas, e a tela do carrinho |
| **D — Pedido** | `POST /api/pedidos` com conferência de estoque, congelamento de preço e baixa de estoque, mais as telas de checkout e de "meus pedidos" |

A fatia 0 é pré-requisito de todas. As outras quatro correm em paralelo — B não espera A
ficar pronta, porque o catálogo é público.

---

## Como trabalhamos

```
issue no quadro
   ↓
feat/12-adicionar-item-ao-carrinho     branch curta, a partir da dev
   ↓  Pull Request
dev                                    branch padrão do repositório
   ↓  PR de release
main                                   só recebe release
```

- **Sem card, o trabalho não existe.** Mova para `Em progresso` ao começar.
- Branch a partir da `dev`, nomeada `feat/`, `fix/` ou `refactor/` + número da issue.
- PR pequeno: acima de ~400 linhas alteradas, volta sem review.
- **Duas aprovações**: um colega e o mentor. Push direto na `dev` ou na `main` é recusado
  pelo próprio repositório.
- A descrição do PR responde três perguntas: o que muda, por quê, como testei.
- Commits convencionais: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`.

Os acordos completos da turma — cerimônias, papéis e avaliação — estão em
[`turma-gondor`](https://github.com/mentoria-mithril/turma-gondor).

### Definição de Pronto

- [ ] Rota funcionando, com a entrada validada
- [ ] Regra de negócio no serviço — não no controlador, não na tela
- [ ] Teste do caso de borda que você já sabe que existe (estoque zerado, item repetido,
      email duplicado)
- [ ] Tela consumindo a rota de verdade, sem dado mockado
- [ ] PR aprovado por um colega e pelo mentor, e mergeado na `dev`
- [ ] `dev` continua de pé depois do merge
- [ ] Card em `Concluído`

---

Mentor / Product Owner: [@douglasmeneses](https://github.com/douglasmeneses).
