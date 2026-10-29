-- CreateTable
CREATE TABLE "sessao" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessao_token_key" ON "sessao"("token");

-- AddForeignKey
ALTER TABLE "sessao" ADD CONSTRAINT "sessao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
