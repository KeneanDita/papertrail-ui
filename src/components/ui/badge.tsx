import * as React from "react";

import { cn } from "@/lib/cn";

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "neutral" | "success" | "warning" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        variant === "neutral" && "border-white/10 bg-white/5 text-zinc-200",
        variant === "success" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
        variant === "warning" && "border-amber-500/20 bg-amber-500/10 text-amber-200",
        className
      )}
      {...props}
    />
  );
}
