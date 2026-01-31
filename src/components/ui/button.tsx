import * as React from "react";

import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm",
        variant === "primary" &&
          "bg-white text-zinc-900 hover:bg-zinc-200",
        variant === "secondary" &&
          "bg-white/10 text-white hover:bg-white/15 border border-white/10",
        variant === "ghost" && "bg-transparent text-white hover:bg-white/10",
        variant === "danger" && "bg-red-500/90 text-white hover:bg-red-500",
        className
      )}
      {...props}
    />
  );
}
