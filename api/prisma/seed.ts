/**
 * Popula o catálogo. Não existe cadastro de livro pela aplicação — o acervo
 * entra por aqui.
 *
 *   npm run seed
 *
 * É idempotente: roda quantas vezes quiser sem duplicar.
 */
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const ACERVO = [
  { titulo: 'Dom Casmurro', autor: 'Machado de Assis', categoria: 'Clássico brasileiro', preco: '39.90', estoque: 12 },
  { titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', categoria: 'Clássico brasileiro', preco: '42.50', estoque: 8 },
  { titulo: 'Grande Sertão: Veredas', autor: 'João Guimarães Rosa', categoria: 'Clássico brasileiro', preco: '78.00', estoque: 4 },
  { titulo: 'Vidas Secas', autor: 'Graciliano Ramos', categoria: 'Clássico brasileiro', preco: '34.90', estoque: 15 },
  { titulo: 'A Hora da Estrela', autor: 'Clarice Lispector', categoria: 'Clássico brasileiro', preco: '36.00', estoque: 9 },
  { titulo: 'O Cortiço', autor: 'Aluísio Azevedo', categoria: 'Clássico brasileiro', preco: '29.90', estoque: 0 },
  { titulo: 'Quarto de Despejo', autor: 'Carolina Maria de Jesus', categoria: 'Clássico brasileiro', preco: '44.00', estoque: 7 },
  { titulo: 'Torto Arado', autor: 'Itamar Vieira Junior', categoria: 'Ficção contemporânea', preco: '54.90', estoque: 20 },
  { titulo: 'O Avesso da Pele', autor: 'Jeferson Tenório', categoria: 'Ficção contemporânea', preco: '49.90', estoque: 11 },
  { titulo: 'Um Defeito de Cor', autor: 'Ana Maria Gonçalves', categoria: 'Ficção contemporânea', preco: '99.00', estoque: 3 },
  { titulo: 'Cem Anos de Solidão', autor: 'Gabriel García Márquez', categoria: 'Ficção estrangeira', preco: '69.90', estoque: 14 },
  { titulo: 'A Metamorfose', autor: 'Franz Kafka', categoria: 'Ficção estrangeira', preco: '24.90', estoque: 25 },
  { titulo: '1984', autor: 'George Orwell', categoria: 'Ficção estrangeira', preco: '47.00', estoque: 18 },
  { titulo: 'A Revolução dos Bichos', autor: 'George Orwell', categoria: 'Ficção estrangeira', preco: '32.00', estoque: 22 },
  { titulo: 'Mrs. Dalloway', autor: 'Virginia Woolf', categoria: 'Ficção estrangeira', preco: '41.50', estoque: 0 },
  { titulo: 'O Homem que Calculava', autor: 'Malba Tahan', categoria: 'Divulgação científica', preco: '38.00', estoque: 16 },
  { titulo: 'Sapiens', autor: 'Yuval Noah Harari', categoria: 'Divulgação científica', preco: '89.90', estoque: 6 },
  { titulo: 'A Origem das Espécies', autor: 'Charles Darwin', categoria: 'Divulgação científica', preco: '74.00', estoque: 5 },
  { titulo: 'Rápido e Devagar', autor: 'Daniel Kahneman', categoria: 'Divulgação científica', preco: '82.00', estoque: 10 },
  { titulo: 'O Programador Pragmático', autor: 'Andrew Hunt e David Thomas', categoria: 'Tecnologia', preco: '119.00', estoque: 13 },
  { titulo: 'Código Limpo', autor: 'Robert C. Martin', categoria: 'Tecnologia', preco: '134.90', estoque: 9 },
  { titulo: 'Refatoração', autor: 'Martin Fowler', categoria: 'Tecnologia', preco: '159.00', estoque: 2 },
  { titulo: 'Entendendo Algoritmos', autor: 'Aditya Bhargava', categoria: 'Tecnologia', preco: '92.00', estoque: 17 },
  { titulo: 'Domain-Driven Design', autor: 'Eric Evans', categoria: 'Tecnologia', preco: '178.00', estoque: 1 },
]

async function principal() {
  console.log(`Populando o catálogo com ${ACERVO.length} livros...`)

  for (const livro of ACERVO) {
    // Sem `upsert` por título único no schema, então a idempotência é na mão:
    // se já existe um livro com este título e autor, não cria de novo.
    const existente = await prisma.livro.findFirst({
      where: { titulo: livro.titulo, autor: livro.autor },
      select: { id: true },
    })

    if (existente) continue

    await prisma.livro.create({
      data: {
        titulo: livro.titulo,
        autor: livro.autor,
        categoria: livro.categoria,
        sinopse: `Sinopse de "${livro.titulo}", de ${livro.autor}. Texto de exemplo do seed — a fatia B mostra isto na página de detalhe.`,
        preco: new Prisma.Decimal(livro.preco),
        estoque: livro.estoque,
      },
    })
  }

  const total = await prisma.livro.count()
  console.log(`Catálogo com ${total} livros.`)
  console.log('Dois livros estão com estoque 0 de propósito — é o caso de borda da fatia B.')
}

principal()
  .then(() => prisma.$disconnect())
  .catch(async (erro) => {
    console.error(erro)
    await prisma.$disconnect()
    process.exit(1)
  })
