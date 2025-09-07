import React from "react";
import { cn } from "@/lib/cn";

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="absolute inset-0 grid place-items-center p-4">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-white w-full max-w-lg rounded-xl shadow-lg p-4", className)} {...props} />;
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-2", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold text-lg", className)} {...props} />;
}


