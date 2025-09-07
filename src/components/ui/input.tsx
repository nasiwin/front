import React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm",
          "placeholder:text-slate-400 focus-visible:outline-none focus:ring-2 focus:ring-slate-900/10",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


