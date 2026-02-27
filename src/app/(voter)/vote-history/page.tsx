import { getSession } from "@/actions/auth-actions";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

const POSITION_ORDER = [
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

const POSITION_ORDER_INDEX = new Map<string, number>(
  POSITION_ORDER.map((position, index) => [position, index]),
);

type VoteChoice = {
  positionId: string;
  positionName: string;
  candidateName: string;
  positionCreatedAt: Date;
};

type VoteHistoryItem = {
  electionId: string;
  electionName: string;
  electionSlug: string;
  startDate: Date | null;
  votedOn: Date;
  choices: VoteChoice[];
  positionOrderById: Record<string, number>;
};

export const revalidate = 0;

export default async function VoteHistoryPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const voter = await prisma.voter.findUnique({
    where: { voterId: session.user.id },
    select: { id: true },
  });

  if (!voter) {
    redirect("/");
  }

  const votes = await prisma.vote.findMany({
    where: { voterId: voter.id },
    orderBy: [{ createdAt: "desc" }],
    include: {
      election: {
        select: {
          id: true,
          slug: true,
          name: true,
          start: true,
          positions: {
            select: {
              id: true,
            },
            orderBy: [{ createdAt: "asc" }, { name: "asc" }],
          },
        },
      },
      position: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
      candidate: {
        select: {
          fullName: true,
        },
      },
    },
  });

  const byElection = new Map<string, VoteHistoryItem>();

  for (const vote of votes) {
    const existing = byElection.get(vote.electionId);
    const choice = {
      positionId: vote.position.id,
      positionName: vote.position.name,
      candidateName: vote.candidate.fullName,
      positionCreatedAt: vote.position.createdAt,
    };

    if (!existing) {
      byElection.set(vote.electionId, {
        electionId: vote.electionId,
        electionName: vote.election.name,
        electionSlug: vote.election.slug,
        startDate: vote.election.start,
        votedOn: vote.createdAt,
        choices: [choice],
        positionOrderById: Object.fromEntries(
          vote.election.positions.map((position, index) => [
            position.id,
            index,
          ]),
        ),
      });
      continue;
    }

    if (vote.createdAt > existing.votedOn) {
      existing.votedOn = vote.createdAt;
    }
    existing.choices.push(choice);
  }

  const history = Array.from(byElection.values())
    .map((item) => ({
      ...item,
      choices: item.choices.sort(
        (a, b) =>
          (POSITION_ORDER_INDEX.get(a.positionName.toUpperCase()) ??
            Number.MAX_SAFE_INTEGER) -
            (POSITION_ORDER_INDEX.get(b.positionName.toUpperCase()) ??
              Number.MAX_SAFE_INTEGER) ||
          (item.positionOrderById[a.positionId] ?? Number.MAX_SAFE_INTEGER) -
            (item.positionOrderById[b.positionId] ?? Number.MAX_SAFE_INTEGER) ||
          a.positionCreatedAt.getTime() - b.positionCreatedAt.getTime() ||
          a.positionName.localeCompare(b.positionName),
      ),
    }))
    .sort((a, b) => b.votedOn.getTime() - a.votedOn.getTime());

  return (
    <section className="space-y-5 mt-5 px-2 sm:px-5 lg:mt-8 xl:px-10">
      <div className="rounded-2xl border bg-white p-6 text-center">
        <h2 className="text-2xl text-brand-100 lg:text-3xl">Vote History</h2>
        <p className="mt-2 text-slate-600">
          Review your past voting activity and open each ballot to see your
          votes per position.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4 py-3">Election</TableHead>
              <TableHead className="px-4 py-3">Start Date</TableHead>
              <TableHead className="px-4 py-3">Voted On</TableHead>
              <TableHead className="px-4 py-3 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No voting history found.
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.electionId}>
                  <TableCell className="px-4 py-3 font-medium">
                    {item.electionName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-600">
                    {item.startDate
                      ? parseDate(new Date(item.startDate))
                      : "--"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-600">
                    {parseDate(new Date(item.votedOn))}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Dialog>
                      <DialogTrigger
                        className={buttonVariants({ variant: "link" })}
                      >
                        View Ballot
                        <ChevronRight />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-brand-100 text-2xl">
                            {item.electionName}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="mt-2 space-y-2.5">
                          {item.choices.map((choice) => (
                            <p
                              key={`${item.electionId}-${choice.positionName}`}
                              className="text-lg"
                            >
                              <span className="font-semibold">
                                {choice.positionName}:
                              </span>{" "}
                              {choice.candidateName}
                            </p>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
