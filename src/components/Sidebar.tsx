"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/cn";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/papers", label: "Papers", icon: FileText },
  { href: "/users", label: "Users", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-dvh flex-col">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 border border-white/10">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">PaperTrail</div>
            <div className="text-xs text-zinc-400">Admin UI</div>
          </div>
        </div>
      </div>

      <div className="px-3">
        <div className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                  active ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-white" : "text-zinc-400")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto px-5 py-5 text-xs text-zinc-500">
        <div>API UI for PaperTrail</div>
        <div className="mt-1">Set your JWT in Settings.</div>
      </div>
    </div>
  );
}
