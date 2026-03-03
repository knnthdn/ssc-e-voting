import "dotenv/config";

import prisma from "@/lib/prisma";

const SEEDED_ELECTION_NAME = "Sample Student Council Election";

async function main() {
  const seedUsers = await prisma.user.findMany({
    where: {
      email: {
        startsWith: "seed",
      },
    },
    select: {
      id: true,
      email: true,
    },
  });

  const userIds = seedUsers.map((user) => user.id);

  const election = await prisma.election.findUnique({
    where: { name: SEEDED_ELECTION_NAME },
    select: { id: true },
  });

  if (election) {
    await prisma.vote.deleteMany({ where: { electionId: election.id } });
    await prisma.election.delete({ where: { id: election.id } });
  }

  if (userIds.length > 0) {
    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }

  console.log(`Deleted seed users: ${userIds.length}`);
  console.log(`Deleted seeded election: ${election ? "yes" : "no"}`);
}

main()
  .catch((error) => {
    console.error("Failed to cleanup seed data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
