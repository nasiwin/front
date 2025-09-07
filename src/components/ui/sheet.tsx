import React from "react";
import { cn } from "@/lib/cn";

export function Sheet({ children }: { children: React.ReactNode }) { return <>{children}</>; }

export function SheetTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  return <>{children}</>;
}

export function SheetContent({ className, side = "right", children }: { className?: string; side?: "right" | "left"; children: React.ReactNode }) {
  return (
    <div className={cn(
      "fixed top-0 bottom-0 w-80 bg-white shadow-lg z-50",
      side === "right" ? "right-0" : "left-0",
      className
    )}>
      {children}
    </div>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 border-b", className)} {...props} />;
}
export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold", className)} {...props} />;
}


