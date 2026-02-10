import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageElection from "@/features/admin/_components/manage/manage_election/ManageElection";
import prisma from "@/lib/prisma";
import { Suspense } from "react";

export const revalidate = 0;

type Params = Promise<{ electionId: string }>;

export default async function ElectionPage({ params }: { params: Params }) {
  const { electionId } = await params;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FetchElection electionId={electionId} />
    </Suspense>
  );
}

const triggerList = [
  { label: "Election Statistic", value: "statistic" },
  { label: "Manage Election", value: "manage" },
  { label: "Configure", value: "configure" },
];

async function FetchElection({ electionId }: { electionId: string }) {
  const election = await prisma.election.findFirst({
    where: { slug: electionId },
    include: {
      positions: true,
      partylists: true,
    },
  });

  if (!election) return <div>Not Found!</div>;

  return (
    <Tabs defaultValue="statistic" className="w-full h-full">
      <TabsList className="w-full bg-gray-100">
        {triggerList.map((items) => {
          return (
            <TabsTrigger
              key={items.value}
              value={items.value}
              className="text-xs sm:text-sm capitalize cursor-pointer data-[state=active]:bg-brand-light-200 data-[state=active]:text-white"
            >
              {items.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="statistic">
        Make changes to your account here.
      </TabsContent>

      <TabsContent value="manage">
        <ManageElection election={election} />
      </TabsContent>

      <TabsContent value="configure">Configure</TabsContent>
    </Tabs>
  );
}
