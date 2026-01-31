"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { apiRequest, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { getStoredToken } from "@/lib/settings";
import type { Paper } from "@/lib/types";

import { PageHeader } from "@/components/PageHeader";
import { RequireToken } from "@/components/RequireToken";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function PapersPage() {
  const [token, setToken] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const refresh = () => setToken(getStoredToken());
    refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "papertrail.jwt") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const hasToken = Boolean(token);

  async function load() {
    if (!token) return;

    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<Paper[]>("/api/papers", { token });
      setPapers(data);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Failed to load papers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const items = useMemo(() => papers.slice(), [papers]);

  return (
    <div>
      <PageHeader
        title="Papers"
        description="Create and browse submitted papers."
        actions={
          <>
            <Button variant="secondary" onClick={load} disabled={!hasToken || loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </Button>
            <Link href="/papers/new">
              <Button>Create paper</Button>
            </Link>
          </>
        }
      />

      <RequireToken hasToken={hasToken} />

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>All papers</CardTitle>
            <CardDescription>{items.length} total</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? <div className="text-sm text-red-300">{error}</div> : null}

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Spinner /> Loading…
              </div>
            ) : null}

            {!loading && hasToken && items.length === 0 ? (
              <div className="text-sm text-zinc-400">No papers yet. Create one to get started.</div>
            ) : null}

            <div className="mt-3 grid grid-cols-1 gap-3">
              {items.map((p) => (
                <Link
                  key={p.id}
                  href={`/papers/${p.id}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{p.title || "(untitled)"}</div>
                      <div className="mt-1 line-clamp-2 text-sm text-zinc-400">{p.abstract || "—"}</div>
                      <div className="mt-2 text-xs text-zinc-500">author_id: {p.author_id || "—"}</div>
                    </div>
                    <div className="shrink-0 text-xs text-zinc-500">{formatDateTime(p.created_at)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
