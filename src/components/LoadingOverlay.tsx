type LoadingOverlayProps = {
  isLoading: boolean;
  text: string;
};

export default function LoadingOverlay({
  isLoading,
  text,
}: LoadingOverlayProps) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs flex-col gap-3">
      <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin" />
      <p className="text-xl text-white">{text}</p>
    </div>
  );
}
