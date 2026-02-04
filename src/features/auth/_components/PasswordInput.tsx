"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  id: string;
} & React.ComponentPropsWithoutRef<"input">;

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ id, className, ...props }, ref) => {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        id={id}
        type={show ? "text" : "password"}
        className={cn(
          "focus-visible:border-brand-light-400 focus-visible:ring-brand-light-400 border-gray-400 py-5 pr-10 focus-visible:ring-1 focus-visible:ring-offset-0",
          className,
        )}
        {...props}
      />

      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
