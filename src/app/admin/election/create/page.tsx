import CreateElectionFields from "@/features/admin/_components/create/CreateElectionFields";

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
        <CreateElectionFields />
      </div>
    </div>
  );
}
