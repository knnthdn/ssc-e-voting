import "dotenv/config";
import { ElectionStatus } from "../src/lib/generated/prisma/client";
import slugify from "slugify";
import { electionData } from "../placeholder/election-test-data";
import prisma from "@/lib/prisma";

type SeedElection = {
  name: string;
  status: ElectionStatus;
  description: string;
  start: Date;
  end: Date;
  slug: string;
};

import "../placeholder/election-test-data.ts";

function normalizeElection(input: (typeof electionData)[number]): SeedElection {
  const start = new Date(input.start);
  const end = new Date(input.end);
  end.setHours(0, 0, 0, 0);

  return {
    name: input.name,
    status: input.status as ElectionStatus,
    description: input.description,
    start,
    end,
    slug: slugify(input.name, { replacement: "-", lower: true }),
  };
}

async function main() {
  const data = electionData.map(normalizeElection);

  const result = await prisma.election.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`Inserted ${result.count} elections.`);
}

main()
  .catch((error) => {
    console.error("Failed to insert elections:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
