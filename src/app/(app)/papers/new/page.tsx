"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest, ApiError } from "@/lib/api";
import { getStoredToken } from "@/lib/settings";
import type { Paper } from "@/lib/types";

import { PageHeader } from "@/components/PageHeader";
import { RequireToken } from "@/components/RequireToken";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

export default function NewPaperPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setToken(getStoredToken());
  }, []);

  const hasToken = Boolean(token);

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const created = await apiRequest<Paper>("/api/papers", {
        method: "POST",
        token,
        body: {
          title,
          abstract,
          author_id: authorId,
          pdf_url: pdfUrl,
        },
      });
      router.push(`/papers/${created.id}`);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Failed to create paper");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Create paper" description="POST /api/papers" />

      <RequireToken hasToken={hasToken} />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Paper details</CardTitle>
          <CardDescription>Fill the fields and submit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="mb-1 text-xs text-zinc-400">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A Novel Approach to …" />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-400">Abstract</div>
            <Textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Summary…" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-xs text-zinc-400">Author ID</div>
              <Input value={authorId} onChange={(e) => setAuthorId(e.target.value)} placeholder="user public_id" />
            </div>
            <div>
              <div className="mb-1 text-xs text-zinc-400">PDF URL</div>
              <Input value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://…" />
            </div>
          </div>

          <Button onClick={submit} disabled={!hasToken || submitting}>
            {submitting ? (
              <>
                <Spinner /> Creating…
              </>
            ) : (
              "Create"
            )}
          </Button>

          {error ? <div className="text-sm text-red-300">{error}</div> : null}
        </CardContent>
      </Card>
    </div>
  );
}
