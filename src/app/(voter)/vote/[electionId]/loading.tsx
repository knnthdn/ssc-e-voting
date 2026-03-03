import VotersLoading from "@/features/voters/_component/VotersLoading";
import { Skeleton } from "@/components/ui/skeleton";

export default function VoteElectionLoading() {
  return (
    <section className="px-5 md:px-10 py-5 space-y-8 mt-5">
      <Skeleton className="h-9 w-96 max-w-full" />

      <div className="flex flex-col gap-10 pb-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="sm:max-w-sm space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-60" />
          </div>

          <Skeleton className="h-10 w-32 self-end" />
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <VotersLoading key={`vote-election-loading-${index}`} />
        ))}
      </div>
    </section>
  );
}
