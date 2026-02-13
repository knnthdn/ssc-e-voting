import "dotenv/config";
import { candidateData } from "../placeholder/candidate-test-data";
import { Gender } from "../src/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";

type SeedCandidate = {
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  gender: Gender;
  dateOfBirth: Date;
  schoolId: string;
  image: string;
  positionId: string;
  partylistId?: string;
};

import "../placeholder/candidate-test-data.ts";

function normalizeCandidate(
  input: (typeof candidateData)[number],
): SeedCandidate {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    fullName: `${input.firstName} ${input.lastName}`,
    bio: input.bio,
    gender: input.gender as Gender,
    dateOfBirth: new Date(input.dateOfBirth),
    schoolId: input.schoolId,
    image: input.image,
    positionId: input.positionId,
    partylistId: input.partylistId?.trim() || undefined,
  };
}

async function main() {
  const data = candidateData.map(normalizeCandidate);

  const result = await prisma.candidate.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`Inserted ${result.count} candidates.`);
}

main()
  .catch((error) => {
    console.error("Failed to insert candidates:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
