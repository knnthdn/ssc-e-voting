-- CreateTable
CREATE TABLE "vote" (
    "id" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vote_voterId_electionId_idx" ON "vote"("voterId", "electionId");

-- CreateIndex
CREATE INDEX "vote_candidateId_idx" ON "vote"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "vote_voterId_electionId_positionId_key" ON "vote"("voterId", "electionId", "positionId");

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "voter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "canditate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
