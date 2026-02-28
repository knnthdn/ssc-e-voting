import ManageElectionList from "@/features/admin/_components/manage/ManageElectionList";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ManagePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") query.set(key, value);
  }

  const url = `${process.env.BETTER_AUTH_URL}/api/admin/election?${query.toString()}`;

  return <ManageElectionList url={url} />;
}
