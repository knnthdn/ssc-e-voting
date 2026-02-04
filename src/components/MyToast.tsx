import { toast } from "sonner";

export const MyToast = {
  error: (txt: string) => {
    toast(
      <div className="flex gap-1 text-base text-red-500">
        <p>{txt}</p>
      </div>,
    );
  },
};
