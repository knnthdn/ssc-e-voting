import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ButtonProps = React.ComponentProps<typeof Button>;

interface SocialAuthButtonProps extends ButtonProps {
  children: ReactNode;
  className?: string;
  text: string;
}

export default function SocialAuthButton({
  children,
  className,
  text,
  ...props
}: SocialAuthButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "hover:bg-discord-gray relative flex h-10 w-full items-center justify-center gap-3 rounded-md bg-black text-sm font-medium text-white hover:cursor-pointer",
        className,
      )}
    >
      <span className="absolute left-1 flex h-8 w-8 items-center justify-center rounded bg-white">
        {children}
      </span>
      {text}
    </Button>
  );
}
