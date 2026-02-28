import CreateElectionFields from "@/features/admin/_components/create/CreateElectionFields";
import { Suspense } from "react";

function CreateElectionFallback() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-40 rounded bg-slate-200 animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-10 rounded bg-slate-200 animate-pulse" />
        <div className="h-10 rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="h-32 rounded bg-slate-200 animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-10 rounded bg-slate-200 animate-pulse" />
        <div className="h-10 rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="h-56 rounded bg-slate-200 animate-pulse" />
    </div>
  );
}

export default function CreatePage() {
  return (
    <div className="p-4">
      <div className="mx-auto max-w-5xl">
        {/* HEADINGS  */}
        <div>
          <h2 className="text-3xl text-brand-100 font-medium">
            Create Election
          </h2>
          <p className="text-gray-500">
            fill in the details to create a new election
          </p>
        </div>

        <div className="w-full h-px my-8 bg-gray-200" />

        {/* CREATE ELECTION FIELDS FORM */}

        <Suspense fallback={<CreateElectionFallback />}>
          <CreateElectionFields />
        </Suspense>
      </div>
    </div>
  );
}
