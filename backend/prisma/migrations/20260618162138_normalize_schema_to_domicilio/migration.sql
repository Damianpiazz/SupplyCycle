/*
  Warnings:

  - You are about to drop the column `calle` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `diaEntrega` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `horarioDesde` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `horarioHasta` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `latitud` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `localidad` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `longitud` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `Pedido` table. All the data in the column will be lost.
  - Added the required column `localidad` to the `Domicilio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domicilioId` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_clienteId_fkey";

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "calle",
DROP COLUMN "diaEntrega",
DROP COLUMN "horarioDesde",
DROP COLUMN "horarioHasta",
DROP COLUMN "latitud",
DROP COLUMN "localidad",
DROP COLUMN "longitud",
DROP COLUMN "numero";

-- AlterTable
ALTER TABLE "Domicilio" ADD COLUMN     "latitud" DOUBLE PRECISION,
ADD COLUMN     "localidad" VARCHAR(200) NOT NULL,
ADD COLUMN     "longitud" DOUBLE PRECISION,
ADD COLUMN     "principal" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "clienteId",
ADD COLUMN     "domicilioId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_domicilioId_fkey" FOREIGN KEY ("domicilioId") REFERENCES "Domicilio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
