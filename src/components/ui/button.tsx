import React from "react";
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "destructive";
  size?: "default" | "icon";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";
    const variants: Record<string, string> = {
      default: "bg-black text-white hover:opacity-90",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-900",
      destructive: "bg-red-600 text-white hover:bg-red-700",
    };
    const sizes: Record<string, string> = {
      default: "h-9 px-3",
      icon: "h-9 w-9 p-0",
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    );
  }
);
Button.displayName = "Button";


