"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiRequest, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { getEffectiveApiBaseUrl } from "@/lib/settings";
import type { Paper } from "@/lib/types";

import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function PublicPaperDetailPage({ params }: { params: { id: string } }) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBaseUrl = getEffectiveApiBaseUrl();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const p = await apiRequest<Paper>(`/api/papers/${params.id}`);
      setPaper(p);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Failed to load paper");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <PageHeader
        title="Public paper"
        description={params.id}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="neutral">{apiBaseUrl}</Badge>
            <Link href="/public/papers">
              <Button variant="secondary">Back</Button>
            </Link>
            <Button variant="secondary" onClick={load} disabled={loading}>
              Refresh
            </Button>
          </div>
        }
      />

      {error ? <div className="mt-4 text-sm text-red-300">{error}</div> : null}

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
          <Spinner /> Loading…
        </div>
      ) : null}

      {paper ? (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{paper.title || "(untitled)"}</CardTitle>
              <CardDescription>Created {formatDateTime(paper.created_at)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-zinc-200 whitespace-pre-wrap">{paper.abstract || "—"}</div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="neutral">author_id: {paper.author_id || "—"}</Badge>
                <Badge variant="neutral">paper_id: {paper.id}</Badge>
              </div>
              {paper.pdf_url ? (
                <a
                  href={paper.pdf_url}
                  className="inline-flex items-center text-sm underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open PDF
                </a>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
