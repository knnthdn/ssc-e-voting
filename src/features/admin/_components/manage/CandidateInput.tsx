import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormInputProps = {
  id: string;
} & React.ComponentPropsWithoutRef<"input">;

export const CandidateInput = React.forwardRef<
  HTMLInputElement,
  FormInputProps
>(({ id, className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      id={id}
      className={cn(
        "focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 py-5 focus-visible:ring-1 focus-visible:ring-offset-0",
        className,
      )}
      {...props}
    />
  );
});

CandidateInput.displayName = "CandidateInput";
