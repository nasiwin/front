import React from "react";
import { cn } from "@/lib/cn";

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full rounded-full bg-slate-200 overflow-hidden", className)}>
      <div className="h-full bg-slate-900" style={{ width: `${pct}%` }} />
    </div>
  );
}


