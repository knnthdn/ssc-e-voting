import ManageElectionList from "@/features/admin/_components/manage/ManageElectionList";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ManagePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const normalizedSearchParams: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") {
      normalizedSearchParams[key] = value;
    }
  }

  return <ManageElectionList searchParams={normalizedSearchParams} />;
}
