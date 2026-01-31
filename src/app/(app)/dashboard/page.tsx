"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiRequest, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { Health } from "@/lib/types";
import { getEffectiveApiBaseUrl, getStoredToken } from "@/lib/settings";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;
    setError("");
    apiRequest<Health>("/health")
      .then((h) => {
        if (active) setHealth(h);
      })
      .catch((e: unknown) => {
        const msg = e instanceof ApiError ? e.message : "Failed to reach API";
        if (active) setError(msg);
      });
    return () => {
      active = false;
    };
  }, []);

  const apiBaseUrl = getEffectiveApiBaseUrl();
  const hasToken = Boolean(getStoredToken());

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Quick health check and shortcuts."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={hasToken ? "success" : "warning"}>JWT: {hasToken ? "set" : "missing"}</Badge>
            <Badge variant="neutral">{apiBaseUrl}</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>API Status</CardTitle>
            <CardDescription>Calls GET /health (no auth).</CardDescription>
          </CardHeader>
          <CardContent>
            {!health && !error ? (
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Spinner /> Checking…
              </div>
            ) : null}

            {error ? <div className="text-sm text-red-300">{error}</div> : null}

            {health ? (
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={health.status === "ok" ? "success" : "warning"}>status: {health.status}</Badge>
                  <Badge variant="neutral">env: {health.env}</Badge>
                  <Badge variant="neutral">version: {health.version}</Badge>
                </div>
                <div className="text-zinc-300">server time: {formatDateTime(health.uptime * 1000)}</div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shortcuts</CardTitle>
            <CardDescription>Core flows in the UI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <Link className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10" href="/papers">
                Browse papers
              </Link>
              <Link className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10" href="/papers/new">
                Create a paper
              </Link>
              <Link className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10" href="/users">
                Manage users
              </Link>
              <Link className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10" href="/settings">
                Configure token/base URL
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
