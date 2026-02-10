import Candidate from "@/features/admin/_components/manage/manage_election/Candidate";

import Status from "@/features/admin/_components/manage/manage_election/Status";
import { Election } from "@/features/admin/_types";

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
    <div className=" h-full p-5 space-y-8">
      {/* Edit Election Status */}
      <Status election={election} />

      <Candidate election={election} />
    </div>
  );
}
