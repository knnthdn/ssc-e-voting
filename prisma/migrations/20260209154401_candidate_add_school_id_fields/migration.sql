/*
  Warnings:

  - Added the required column `image` to the `canditate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolId` to the `canditate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "canditate" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "schoolId" TEXT NOT NULL;
