-- AlterTable
ALTER TABLE "Reclamo" ADD COLUMN "descripcion" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Reclamo" ALTER COLUMN "descripcion" DROP DEFAULT;
