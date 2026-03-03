import "dotenv/config";
import { randomUUID } from "node:crypto";
import slugify from "slugify";

import { ElectionStatus, Gender, ROLE } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";

type ElectionSeed = {
  name: string;
  description: string;
  status: ElectionStatus;
  start: Date;
  end: Date;
};

type SeededVoter = {
  id: string;
  preferredPartyIndex: number;
  loyalty: number;
};

const USER_AND_VOTER_COUNT = 200;
const CANDIDATES_PER_POSITION = 12;

const POSITION_NAMES = [
  "PRESIDENT",
  "INTERNAL VICE-PRESIDENT",
  "EXTERNAL VICE-PRESIDENT",
  "SECRETARY",
  "PARLIAMENTARIAN",
  "FINANCE OFFICER",
  "HISTORIAN",
  "REPORTER",
  "BSBA SENATOR",
  "BSCA SENATOR",
  "BSCS SENATOR",
  "BSED SENATOR",
  "BSHM SENATOR",
  "BSCRIM SENATOR",
  "BSBA REPRESENTATIVE",
  "BSCA REPRESENTATIVE",
  "BSCS REPRESENTATIVE",
  "BSED REPRESENTATIVE",
  "BSHM REPRESENTATIVE",
  "BSCRIM REPRESENTATIVE",
] as const;

const PARTY_NAMES = [
  "Unity Party",
  "Progress Alliance",
  "Student First",
  "Campus Forward",
  "Voice Coalition",
  "Reform Bloc",
  "Future Leaders",
  "Action Team",
  "Campus One",
  "Independent Front",
  "Scholars Union",
  "Student Reform Party",
] as const;

const FIRST_NAMES_MALE = [
  "Mark",
  "Kevin",
  "Joshua",
  "Carlo",
  "Paolo",
  "David",
  "Henry",
  "Miguel",
  "Noel",
  "Rafael",
  "Adrian",
  "Gabriel",
] as const;

const FIRST_NAMES_FEMALE = [
  "Angela",
  "Maria",
  "Bianca",
  "Nina",
  "Elaine",
  "Grace",
  "Patricia",
  "Sofia",
  "Trisha",
  "Kristine",
  "Camille",
  "Ariana",
] as const;

const LAST_NAMES = [
  "Dela Cruz",
  "Santos",
  "Reyes",
  "Garcia",
  "Flores",
  "Mendoza",
  "Castro",
  "Villanueva",
  "Rivera",
  "Torres",
  "Aquino",
  "Valdez",
  "Lopez",
  "Serrano",
  "Navarro",
  "Ramos",
  "Cruz",
  "Morales",
  "Domingo",
  "Pascual",
] as const;

const electionSeed: ElectionSeed = {
  name: "Sample Student Council Election",
  description: "Sample election seeded with complete positions, candidates, users, voters, and votes.",
  status: ElectionStatus.PENDING,
  start: new Date(Date.now() + 24 * 60 * 60 * 1000),
  end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
};

function createLongBio(fullName: string, positionName: string): string {
  return `${fullName} is running for ${positionName} with a leadership plan centered on transparent governance, measurable public service, and regular accountability updates for the student body. This campaign emphasizes fair representation, clear communication with organizations, and inclusive consultation before major decisions are finalized. The platform includes monthly open forums, structured issue tracking, and consistent reporting of approved projects so students can verify progress. ${fullName} also prioritizes academic support programs, student welfare initiatives, and coordinated work with faculty advisers and administration to ensure practical execution of commitments. The objective is to build trust, improve participation, and deliver sustainable outcomes that benefit current students while creating a stronger governance foundation for future campus leaders.`;
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function buildCandidateName(positionIndex: number, partyIndex: number): { firstName: string; lastName: string; gender: Gender } {
  const isFemale = (positionIndex + partyIndex) % 2 === 0;
  const firstName = isFemale
    ? FIRST_NAMES_FEMALE[partyIndex % FIRST_NAMES_FEMALE.length]
    : FIRST_NAMES_MALE[partyIndex % FIRST_NAMES_MALE.length];
  const lastName = LAST_NAMES[(positionIndex + partyIndex) % LAST_NAMES.length];

  return {
    firstName,
    lastName,
    gender: isFemale ? Gender.FEMALE : Gender.MALE,
  };
}

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

function weightedPick(weights: number[]): number {
  const total = weights.reduce((sum, value) => sum + value, 0);
  let point = Math.random() * total;

  for (let i = 0; i < weights.length; i += 1) {
    point -= weights[i];
    if (point <= 0) return i;
  }

  return weights.length - 1;
}

function buildPartyStrengths(): number[] {
  return Array.from({ length: CANDIDATES_PER_POSITION }, (_, index) => {
    const base = 1.4 - index * 0.06;
    const jitter = 0.2 + Math.random() * 0.5;
    return Math.max(0.2, base + jitter);
  });
}

function buildPositionSwing(strengths: number[]): number[] {
  return strengths.map((value) => {
    const swing = 0.8 + Math.random() * 0.5;
    return value * swing;
  });
}

async function seedElectionAndCandidates(seed: ElectionSeed) {
  const slug = slugify(seed.name, { lower: true, strict: true });

  const election = await prisma.election.upsert({
    where: { name: seed.name },
    update: {
      description: seed.description,
      status: seed.status,
      start: seed.start,
      end: seed.end,
      slug,
    },
    create: {
      name: seed.name,
      description: seed.description,
      status: seed.status,
      start: seed.start,
      end: seed.end,
      slug,
    },
  });

  await prisma.$transaction([
    prisma.vote.deleteMany({ where: { electionId: election.id } }),
    prisma.candidate.deleteMany({ where: { position: { electionId: election.id } } }),
    prisma.partylist.deleteMany({ where: { electionId: election.id } }),
    prisma.position.deleteMany({ where: { electionId: election.id } }),
  ]);

  const positions = new Map<string, string>();
  for (const positionName of POSITION_NAMES) {
    const created = await prisma.position.create({
      data: { electionId: election.id, name: positionName },
    });
    positions.set(positionName, created.id);
  }

  const candidatesByPosition = new Map<string, string[]>();

  for (let partyIndex = 0; partyIndex < CANDIDATES_PER_POSITION; partyIndex += 1) {
    const party = await prisma.partylist.create({
      data: {
        electionId: election.id,
        name: PARTY_NAMES[partyIndex],
      },
    });

    for (let positionIndex = 0; positionIndex < POSITION_NAMES.length; positionIndex += 1) {
      const positionName = POSITION_NAMES[positionIndex];
      const positionId = positions.get(positionName);
      if (!positionId) throw new Error(`Missing position: ${positionName}`);

      const name = buildCandidateName(positionIndex, partyIndex);
      const fullName = `${name.firstName} ${name.lastName}`;
      const bio = createLongBio(fullName, positionName);
      if (wordCount(bio) < 100) throw new Error(`Bio under 100 words for ${fullName}`);

      const candidate = await prisma.candidate.create({
        data: {
          firstName: name.firstName,
          lastName: name.lastName,
          fullName,
          bio,
          gender: name.gender,
          dateOfBirth: new Date("2005-01-01"),
          schoolId: `C-${String(positionIndex + 1).padStart(2, "0")}-${String(partyIndex + 1).padStart(2, "0")}`,
          positionId,
          partylistId: party.id,
        },
      });

      const bucket = candidatesByPosition.get(positionId) ?? [];
      bucket.push(candidate.id);
      candidatesByPosition.set(positionId, bucket);
    }
  }

  return {
    electionId: election.id,
    positionIds: Array.from(positions.values()),
    candidatesByPosition,
  };
}

async function seedUsersAndVoters(partyStrengths: number[]): Promise<SeededVoter[]> {
  const voters: SeededVoter[] = [];

  for (let i = 1; i <= USER_AND_VOTER_COUNT; i += 1) {
    const email = `seed.voter.${i}@example.com`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: `Seed Voter ${i}`,
        role: ROLE.VOTER,
        emailVerified: true,
      },
      create: {
        id: randomUUID(),
        name: `Seed Voter ${i}`,
        email,
        emailVerified: true,
        role: ROLE.VOTER,
      },
    });

    const voter = await prisma.voter.upsert({
      where: { voterId: user.id },
      update: {
        firstName: `Voter${i}`,
        lastName: "Seed",
        address: "Sample Address",
        phoneNumber: `0917${String(i).padStart(7, "0")}`,
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        dateOfBirth: new Date("2005-01-01"),
        schoolId: `SEED-${String(i).padStart(4, "0")}`,
      },
      create: {
        voterId: user.id,
        firstName: `Voter${i}`,
        lastName: "Seed",
        address: "Sample Address",
        phoneNumber: `0917${String(i).padStart(7, "0")}`,
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        dateOfBirth: new Date("2005-01-01"),
        schoolId: `SEED-${String(i).padStart(4, "0")}`,
      },
      select: { id: true },
    });

    voters.push({
      id: voter.id,
      preferredPartyIndex: weightedPick(partyStrengths),
      loyalty: 0.55 + Math.random() * 0.3,
    });
  }

  return voters;
}

function pickCandidateForVoter(args: {
  voter: SeededVoter;
  candidateIds: string[];
  positionStrengths: number[];
}): string {
  const { voter, candidateIds, positionStrengths } = args;
  const totalCandidates = candidateIds.length;

  if (totalCandidates === 0) {
    throw new Error("No candidates found for position.");
  }

  const preferredIndex = Math.min(voter.preferredPartyIndex, totalCandidates - 1);
  const loyaltyRoll = Math.random();

  if (loyaltyRoll < voter.loyalty) {
    return candidateIds[preferredIndex];
  }

  const strengthPick = weightedPick(positionStrengths.slice(0, totalCandidates));
  const crossoverRoll = Math.random();

  if (crossoverRoll < 0.75) {
    return candidateIds[strengthPick];
  }

  return candidateIds[randomInt(totalCandidates)];
}

async function seedVotes(input: {
  electionId: string;
  positionIds: string[];
  candidatesByPosition: Map<string, string[]>;
  voters: SeededVoter[];
  partyStrengths: number[];
}) {
  for (const positionId of input.positionIds) {
    const candidateIds = input.candidatesByPosition.get(positionId) ?? [];
    const positionStrengths = buildPositionSwing(input.partyStrengths);

    for (const voter of input.voters) {
      const candidateId = pickCandidateForVoter({
        voter,
        candidateIds,
        positionStrengths,
      });

      await prisma.vote.upsert({
        where: {
          voterId_electionId_positionId: {
            voterId: voter.id,
            electionId: input.electionId,
            positionId,
          },
        },
        update: { candidateId },
        create: {
          voterId: voter.id,
          electionId: input.electionId,
          positionId,
          candidateId,
        },
      });
    }
  }
}

async function main() {
  const partyStrengths = buildPartyStrengths();
  const election = await seedElectionAndCandidates(electionSeed);
  const voters = await seedUsersAndVoters(partyStrengths);

  await seedVotes({
    electionId: election.electionId,
    positionIds: election.positionIds,
    candidatesByPosition: election.candidatesByPosition,
    voters,
    partyStrengths,
  });

  console.log(`Seed completed for election: ${electionSeed.name}`);
  console.log(`Users created/updated with role VOTER: ${USER_AND_VOTER_COUNT}`);
  console.log(`Voters created/updated: ${USER_AND_VOTER_COUNT}`);
  console.log(`Positions seeded: ${POSITION_NAMES.length}`);
  console.log(`Candidates per position: ${CANDIDATES_PER_POSITION}`);
  console.log(`Votes per position: ${USER_AND_VOTER_COUNT}`);
}

main()
  .catch((error) => {
    console.error("Failed to seed election data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

