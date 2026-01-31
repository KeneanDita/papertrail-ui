"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KeyRound, Settings } from "lucide-react";

import { apiRequest } from "@/lib/api";
import { getStoredToken } from "@/lib/settings";
import type { Health } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const [hasToken, setHasToken] = useState(false);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    const refresh = () => setHasToken(Boolean(getStoredToken()));
    refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "papertrail.jwt") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest<Health>("/health")
      .then(() => {
        if (active) setApiOk(true);
      })
      .catch(() => {
        if (active) setApiOk(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {apiOk === null ? (
            <Badge variant="neutral">API: …</Badge>
          ) : apiOk ? (
            <Badge variant="success">API: online</Badge>
          ) : (
            <Badge variant="warning">API: offline</Badge>
          )}
          <Badge variant={hasToken ? "success" : "warning"}>
            <KeyRound className="mr-1 h-3.5 w-3.5" />
            JWT: {hasToken ? "set" : "missing"}
          </Badge>
        </div>

        <Link
          href="/settings"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
