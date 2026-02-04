import { cn } from "@/lib/utils";

type StatsProps = {
  label: string;
  value: number;
  info: string;
  accent: string;
};

export default function StatsCard({ label, value, info, accent }: StatsProps) {
  return (
    <div className="group relative rounded-xl flex flex-col min-h-37.5 lg:min-h-45 xl:min-h-50 2xl:min-h-0 2xl:aspect-video bg-linear-to-br from-white to-slate-50 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 rounded-t-xl bg-brand-100",
          accent,
        )}
      />

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className=" text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
        </div>

        <p className="mt-5 text-sm">- {info}</p>
      </div>
    </div>
  );
}
