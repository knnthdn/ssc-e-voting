import ConfigureFields from "@/features/admin/_components/manage/manage_election/_configure/ConfigureFields";
import DangerZone from "@/features/admin/_components/manage/manage_election/_configure/DangerZone";
import { ManageElectionProps } from "@/features/admin/_components/manage/manage_election/ManageElection";
import { getEffectiveElectionStatus } from "@/lib/election-status";

type ConfigureProp = {
  election: ManageElectionProps;
};

export default function Configure({ election }: ConfigureProp) {
  const { id, name, description, start, end, slug } = election;
  const effectiveStatus = getEffectiveElectionStatus({
    status: election.status,
    start: election.start,
    end: election.end,
  });
  return (
    <div className="w-full max-w-4xl mx-auto p-5 space-y-8">
      <div className="space-y-2">
        <h2 className="text-brand-100 text-2xl font-medium">
          Configure Election
        </h2>
        <p className="text-sm text-black/60">
          Update election details, schedule, and review high-impact actions.
        </p>
      </div>

      {/* CONFIGURE ELECTION FORM  */}
      <div className="rounded-xl border border-gray-200 p-5 sm:p-6 bg-white">
        <ConfigureFields
          data={{
            id,
            name,
            description,
            start,
            end,
            slug,
            status: effectiveStatus,
          }}
        />
      </div>

      <div className="w-full h-px my-10 bg-gray-200" />

      {/* DANGER ZONE */}
      <DangerZone
        id={election.id}
        slug={election.slug}
        status={effectiveStatus}
      />
    </div>
  );
}
