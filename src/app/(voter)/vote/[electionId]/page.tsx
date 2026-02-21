import VotersCandidate from "@/features/voters/_component/VotersCandidate";

type VotersElectionIdProps = {
  params: Promise<{ electionId: string }>;
};

export default async function VotersElectionId({
  params,
}: VotersElectionIdProps) {
  const { electionId } = await params;

  return <VotersCandidate slug={electionId} />;
}
