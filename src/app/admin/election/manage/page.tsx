import ManageElectionList from "@/features/admin/_components/manage/ManageElectionList";
import ElectionLoading from "@/features/admin/_components/manage/ElectionLoading";
import { Suspense } from "react";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ManagePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  const suspenseKey = params.toString() || "default";

  return (
    <Suspense key={suspenseKey} fallback={<ElectionLoading />}>
      <ManageElectionList searchParams={sp} />
    </Suspense>
  );
}
