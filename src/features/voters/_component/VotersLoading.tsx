import { Skeleton } from "@/components/ui/skeleton";

export default function VotersLoading() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-40 h-[35px] bg-brand-100/20" />

      <div className="grid lg:grid-cols-2 gap-5 xl:grid-cols-3 2xl:gap-8">
        {Array.from({ length: 6 }).map((_, i) => {
          return <Skeleton key={i} className="h-50 w-full" />;
        })}
      </div>
    </div>
  );
}
