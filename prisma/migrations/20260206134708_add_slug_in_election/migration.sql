/*
  Warnings:

  - Added the required column `slug` to the `election` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "election" ADD COLUMN     "slug" TEXT NOT NULL;
