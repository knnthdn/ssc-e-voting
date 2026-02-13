/*
  Warnings:

  - Added the required column `fullName` to the `canditate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "canditate" ADD COLUMN     "fullName" TEXT NOT NULL;
