-- CreateEnum
CREATE TYPE "ElectionStatus" AS ENUM ('ONGOING', 'SCHEDULED', 'COMPLETED', 'PENDING', 'STOPPED', 'PAUSED');

-- CreateTable
CREATE TABLE "election" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ElectionStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partylist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partylist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canditate" (
    "id" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "positionId" TEXT NOT NULL,
    "partylistId" TEXT,

    CONSTRAINT "canditate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "election_name_key" ON "election"("name");

-- CreateIndex
CREATE UNIQUE INDEX "partylist_electionId_name_key" ON "partylist"("electionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "position_electionId_name_key" ON "position"("electionId", "name");

-- AddForeignKey
ALTER TABLE "partylist" ADD CONSTRAINT "partylist_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position" ADD CONSTRAINT "position_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canditate" ADD CONSTRAINT "canditate_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canditate" ADD CONSTRAINT "canditate_partylistId_fkey" FOREIGN KEY ("partylistId") REFERENCES "partylist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
