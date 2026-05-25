-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_repartoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "repartoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_repartoId_fkey" FOREIGN KEY ("repartoId") REFERENCES "Reparto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
