import React from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "secondary" | "destructive";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  const variants: Record<Variant, string> = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-900",
    destructive: "bg-red-600 text-white",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs", variants[variant], className)} {...props} />;
}


