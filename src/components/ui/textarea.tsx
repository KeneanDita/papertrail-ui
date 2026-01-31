import * as React from "react";

import { cn } from "@/lib/cn";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-400",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        className
      )}
      {...props}
    />
  );
}
