export default function StatusNote({ status }: { status: string }) {
  if (status === "PENDING" || status === "PAUSED")
    return (
      <p className="text-gray-500 text-sm max-w-2xl">
        This election is in a <span className="underline">{status}</span> state,
        you can still add candidate, partylist and edit position. To start or
        resume the election click the Start button below.
      </p>
    );

  if (status === "ONGOING")
    return (
      <p className="text-gray-500 text-sm max-w-2xl">
        Election is currently <span className="underline">{status}</span>.
        During the election, you can&apos;t edit candidate, partylist and
        position.
      </p>
    );

  if (status === "STOPPED")
    return (
      <p className="text-gray-500 text-sm max-w-2xl">
        This election was stopped and can&apos;s be reopened.
      </p>
    );

  if (status === "COMPLETED")
    return (
      <p className="text-gray-500 text-sm max-w-2xl">
        This election was completed and can&apos;s be reopened.
      </p>
    );
}
