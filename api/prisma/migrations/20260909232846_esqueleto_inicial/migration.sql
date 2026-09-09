-- CreateEnum
CREATE TYPE "status_pedido" AS ENUM ('AGUARDANDO_PAGAMENTO', 'PAGO', 'RECUSADO');

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livro" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "sinopse" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "livro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrinho" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "dt_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrinho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_carrinho" (
    "id" TEXT NOT NULL,
    "carrinho_id" TEXT NOT NULL,
    "livro_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "item_carrinho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "status" "status_pedido" NOT NULL DEFAULT 'AGUARDANDO_PAGAMENTO',
    "valor_total" DECIMAL(10,2) NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_pedido" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "livro_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "item_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE INDEX "livro_titulo_idx" ON "livro"("titulo");

-- CreateIndex
CREATE INDEX "livro_autor_idx" ON "livro"("autor");

-- CreateIndex
CREATE INDEX "livro_categoria_idx" ON "livro"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "carrinho_usuario_id_key" ON "carrinho"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_carrinho_carrinho_id_livro_id_key" ON "item_carrinho"("carrinho_id", "livro_id");

-- CreateIndex
CREATE INDEX "pedido_usuario_id_dt_criacao_idx" ON "pedido"("usuario_id", "dt_criacao");

-- AddForeignKey
ALTER TABLE "carrinho" ADD CONSTRAINT "carrinho_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_carrinho" ADD CONSTRAINT "item_carrinho_carrinho_id_fkey" FOREIGN KEY ("carrinho_id") REFERENCES "carrinho"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_carrinho" ADD CONSTRAINT "item_carrinho_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "livro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "livro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
