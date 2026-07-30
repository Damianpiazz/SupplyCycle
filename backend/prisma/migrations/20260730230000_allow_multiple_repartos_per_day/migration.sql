-- Drop the unique constraint that limited one reparto per repartidor per day
DROP INDEX IF EXISTS "Reparto_repartidorId_fecha_key";
