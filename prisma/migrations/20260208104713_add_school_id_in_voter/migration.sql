-- AlterTable
ALTER TABLE "voter" ADD COLUMN     "schoolId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "election_name_idx" ON "election"("name");

-- CreateIndex
CREATE INDEX "election_createdAt_idx" ON "election"("createdAt");

-- CreateIndex
CREATE INDEX "election_status_idx" ON "election"("status");
