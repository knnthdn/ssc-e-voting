/*
  Warnings:

  - Made the column `positionId` on table `canditate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "canditate" ALTER COLUMN "positionId" SET NOT NULL;
