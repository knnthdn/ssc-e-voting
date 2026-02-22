import Statistic from "@/components/Statistic";

export default function ElectionRanking({
  slug,
  positionName,
  voteTime,
}: {
  slug: string;
  positionName?: string;
  voteTime?: string;
}) {
  return (
    <Statistic
      electionSlug={slug}
      positionName={positionName}
      voteTime={voteTime}
      filterAction={`/admin/election/manage/${slug}`}
    />
  );
}
