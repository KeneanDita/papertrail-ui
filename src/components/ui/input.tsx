import * as React from "react";

import { cn } from "@/lib/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-400",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        className
      )}
      {...props}
    />
  );
}
