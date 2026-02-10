export default function ElectionLoading() {
  return (
    <div className="h-full w-full grid place-content-center">
      <div className="flex flex-col items-center gap-1">
        <div className="size-10 border-4 border-t-transparent border-brand-100 rounded-full animate-spin" />
        <p className="text-brand-800 text-lg">Fetching Election...</p>
      </div>
    </div>
  );
}
