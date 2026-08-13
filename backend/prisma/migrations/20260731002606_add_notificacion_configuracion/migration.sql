-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('RECORDATORIO_ENVASES');

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "contenido" TEXT NOT NULL,
    "enviadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitoso" BOOLEAN NOT NULL DEFAULT true,
    "error" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion" (
    "id" TEXT NOT NULL,
    "clave" VARCHAR(100) NOT NULL,
    "valor" VARCHAR(255) NOT NULL,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_clave_key" ON "configuracion"("clave");

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
