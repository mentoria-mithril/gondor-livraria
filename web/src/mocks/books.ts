import type { Book } from '@/types/cart/cartTypes'

/**
 * Dados falsos para testar a tela ANTES de o `GET /livros` existir.
 *
 * Mora em arquivo separado (e não dentro da página) por dois motivos:
 * quando a rota real chegar, você troca o import por uma chamada de API e
 * a tela não muda; e o `: Book[]` faz o TypeScript reclamar aqui se o
 * contrato mudar, em vez de o erro aparecer só em runtime.
 *
 * `preco` é string de propósito — é assim que o Decimal do Prisma chega
 * no JSON. Mock que mente sobre o tipo esconde o bug até a integração.
 */
export const BOOKS_MOCK: Book[] = [
  {
    id: 1,
    titulo: 'O Senhor dos Anéis: A Sociedade do Anel',
    autor: 'J. R. R. Tolkien',
    categoria: 'Fantasia',
    preco: '89.90',
    capaUrl: 'https://covers.openlibrary.org/b/isbn/9780547928210-M.jpg',
  },
  {
    id: 2,
    titulo: 'O Hobbit',
    autor: 'J. R. R. Tolkien',
    categoria: 'Fantasia',
    preco: '54.50',
    capaUrl: 'https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg',
  },
  {
    id: 3,
    titulo: 'Duna',
    autor: 'Frank Herbert',
    categoria: 'Ficção científica',
    preco: '72.00',
    capaUrl: 'https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg',
  },
]
