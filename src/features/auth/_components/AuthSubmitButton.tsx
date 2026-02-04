import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PropsType = {
  loadingState: boolean;
  loadingText: string;
  text: string;
};

export default function AuthSubmitButton({
  loadingState,
  loadingText,
  text,
}: PropsType) {
  return (
    <Button
      type="submit"
      className={cn("w-full py-5 uppercase")}
      disabled={loadingState}
    >
      {loadingState ? (
        <>
          {loadingText}
          <Icon.loading />
        </>
      ) : (
        text
      )}
    </Button>
  );
}
