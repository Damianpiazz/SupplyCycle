-- Add numero_pedido column (nullable initially for backfill)
ALTER TABLE "Pedido" ADD COLUMN "numero_pedido" VARCHAR(20);

-- Backfill existing rows with sequential PEDIDO #N numbers ordered by creation date
UPDATE "Pedido"
SET "numero_pedido" = 'PEDIDO #' || seq
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "creadoEn") AS seq
  FROM "Pedido"
) AS sub
WHERE "Pedido".id = sub.id;

-- Make the column NOT NULL now that all rows have values
ALTER TABLE "Pedido" ALTER COLUMN "numero_pedido" SET NOT NULL;

-- Add unique constraint
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_numero_pedido_key" UNIQUE ("numero_pedido");
