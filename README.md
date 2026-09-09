# Livraria — turma Gondor

Uma **loja de livros online**: o cliente procura um título, coloca no carrinho, fecha o
pedido e acompanha o que comprou. É o projeto que a turma toca durante o ciclo, em cima
do que já foi visto em aula — a engine de carrinho do encontro 01 e a containerização do
encontro 05 entram aqui, agora dentro de um produto de verdade.

O quadro da turma: <https://github.com/orgs/mentoria-mithril/projects/5>

> **Este repositório está vazio de propósito.** A primeira sprint monta o esqueleto
> (fatia 0, abaixo). O que está escrito neste README é o **escopo acordado**: o que o
> produto faz, quais são as entidades e quem entrega o quê. Antes de abrir um card,
> volte aqui.

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
| API | Node 22+ e Express |
| Banco | PostgreSQL, acessado com `pg` (SQL escrito à mão, sem ORM) |
| Ambiente | Docker Compose sobe o banco; a API roda em container a partir da sprint de infra |
| Testes | `node:test` — o runner nativo, o mesmo do kata de TDD |
| Front | Uma página por tela, consumindo a API. A escolha da biblioteca é decisão da turma na sprint 1 |

SQL na mão é intencional: o objetivo do ciclo é vocês enxergarem a consulta que roda,
não a que o ORM gera.

---

## O modelo de dados

Seis tabelas. É o suficiente para a loja inteira:

| Tabela | Campos que importam |
| --- | --- |
| `usuario` | id, nome, email (único), senha (hash), dt_criacao |
| `livro` | id, titulo, autor, categoria, sinopse, preco, estoque, dt_criacao |
| `carrinho` | id, usuario_id (FK), dt_atualizacao |
| `item_carrinho` | id, carrinho_id (FK), livro_id (FK), quantidade — **único por (carrinho_id, livro_id)** |
| `pedido` | id, usuario_id (FK), status, valor_total, dt_criacao |
| `item_pedido` | id, pedido_id (FK), livro_id (FK), quantidade, **preco_unitario** |

Duas decisões que vão aparecer em review, então já ficam escritas:

- **`item_pedido.preco_unitario` existe de propósito.** O preço do pedido é o preço do dia
  da compra. Se o `livro.preco` mudar amanhã, o pedido de ontem não pode mudar junto —
  quem lê o preço do pedido pela tabela `livro` vai receber comentário no PR.
- **A unicidade de `(carrinho_id, livro_id)` é do banco, não do código.** É o que impede
  duas linhas do mesmo livro no mesmo carrinho mesmo com duas requisições concorrentes.

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
├── rotas/           só diz qual URL chama qual controlador
├── controladores/   entrada e saída de HTTP. Sem regra de negócio.
├── servicos/        ← a regra de negócio mora aqui
├── repositorios/    único lugar que escreve SQL
├── esquemas/        validação da entrada
├── middlewares/     autenticação e tratamento de erro
└── erros/           ErroDeDominio: erro esperado, não é bug
```

Três regras que valem em review:

1. **Controlador não decide nada.** `if` de regra de negócio no controlador tem lugar
   certo: o serviço.
2. **Serviço não conhece `req` nem `res`.** Recebe dado, devolve dado. É isso que deixa
   ele testável sem subir servidor.
3. **Só repositório escreve SQL.** Consulta espalhada em serviço volta no review.

Erro esperado — livro sem estoque, email já cadastrado — é
`throw new ErroDeDominio("...", 409)`, e o middleware transforma em resposta HTTP.
Não encha o controlador de `try/catch`.

---

## As fatias

Cada dupla pega uma **fatia vertical completa** — tabela, repositório, serviço, rota e
tela. Ninguém é "o do backend". É assim que duas duplas quase nunca encostam no mesmo
arquivo e o merge para de doer.

| Fatia | O que entrega |
| --- | --- |
| **0 — Esqueleto** | Sprint 1, a turma inteira junto: `docker compose` com o Postgres, projeto da API de pé, `GET /api/saude` respondendo, script de migração e o *seed* do catálogo. É o exemplo que as outras fatias copiam. |
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
