import Status from "@/features/admin/_components/manage/manage_election/_status/Status";
import Candidate from "@/features/admin/_components/manage/manage_election/_candidate/Candidate";

import { Election } from "@/features/admin/_types";
import Position from "@/features/admin/_components/manage/manage_election/_position/Position";
import { Suspense } from "react";
import Partylist from "@/features/admin/_components/manage/manage_election/_partylist/Partylist";

export interface ManageElectionProps extends Election {
  positions: {
    id: string;
    name: string;
    electionId: string;
    createdAt: Date;
  }[];
  partylists: {
    id: string;
    name: string;
    electionId: string;
    createdAt: Date;
  }[];
}

export default function ManageElection({
  election,
}: {
  election: ManageElectionProps;
}) {
  return (
    <div className=" h-full p-5 flex flex-col gap-16">
      {/* Edit Election Status */}
      <Status election={election} />

      {/* CANDIDATE  */}
      <Candidate election={election} />

      {/* POSITION */}
      <Suspense fallback={<p>Loading....</p>}>
        <Position slug={election.slug} />
      </Suspense>

      {/* PARTYLIST */}
      <Partylist election={election} />
    </div>
  );
}
