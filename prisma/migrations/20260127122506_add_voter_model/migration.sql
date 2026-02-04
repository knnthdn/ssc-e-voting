/*
  Warnings:

  - You are about to drop the `Voter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Voter" DROP CONSTRAINT "Voter_voterId_fkey";

-- DropTable
DROP TABLE "Voter";

-- CreateTable
CREATE TABLE "voter" (
    "id" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voter_voterId_key" ON "voter"("voterId");

-- AddForeignKey
ALTER TABLE "voter" ADD CONSTRAINT "voter_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
