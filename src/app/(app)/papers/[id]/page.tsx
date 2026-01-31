"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiRequest, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { getStoredToken } from "@/lib/settings";
import type { Comment, Paper, Review } from "@/lib/types";

import { PageHeader } from "@/components/PageHeader";
import { RequireToken } from "@/components/RequireToken";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

export default function PaperDetailPage({ params }: { params: { id: string } }) {
  const [token, setToken] = useState("");
  const [paper, setPaper] = useState<Paper | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [reviewerId, setReviewerId] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [postingReview, setPostingReview] = useState(false);

  const [commentUserId, setCommentUserId] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    setToken(getStoredToken());
  }, []);

  const hasToken = Boolean(token);

  async function load() {
    if (!token) return;

    setLoading(true);
    setError("");
    try {
      const [p, r, c] = await Promise.all([
        apiRequest<Paper>(`/api/papers/${params.id}`, { token }),
        apiRequest<Review[]>(`/api/papers/${params.id}/reviews`, { token }),
        apiRequest<Comment[]>(`/api/papers/${params.id}/comments`, { token }),
      ]);
      setPaper(p);
      setReviews(r);
      setComments(c);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Failed to load paper");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, params.id]);

  async function addReview() {
    setPostingReview(true);
    setError("");
    try {
      await apiRequest<Review>(`/api/papers/${params.id}/reviews`, {
        method: "POST",
        token,
        body: { reviewer_id: reviewerId, rating, comments: reviewText },
      });
      setReviewerId("");
      setRating(5);
      setReviewText("");
      await load();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Failed to add review");
    } finally {
      setPostingReview(false);
    }
  }

  async function addComment() {
    setPostingComment(true);
    setError("");
    try {
      await apiRequest<Comment>(`/api/papers/${params.id}/comments`, {
        method: "POST",
        token,
        body: { user_id: commentUserId, body: commentBody },
      });
      setCommentUserId("");
      setCommentBody("");
      await load();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Failed to add comment");
    } finally {
      setPostingComment(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Paper"
        description={params.id}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/papers">
              <Button variant="secondary">Back</Button>
            </Link>
            <Button variant="secondary" onClick={load} disabled={!hasToken || loading}>
              Refresh
            </Button>
          </div>
        }
      />

      <RequireToken hasToken={hasToken} />

      {error ? <div className="mt-4 text-sm text-red-300">{error}</div> : null}

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
          <Spinner /> Loading…
        </div>
      ) : null}

      {paper ? (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">{paper.title || "(untitled)"}</CardTitle>
              <CardDescription>Created {formatDateTime(paper.created_at)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-zinc-200">{paper.abstract || "—"}</div>
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

          <Card>
            <CardHeader>
              <CardTitle>Add review</CardTitle>
              <CardDescription>POST /api/papers/{params.id}/reviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-1 text-xs text-zinc-400">Reviewer ID</div>
                <Input value={reviewerId} onChange={(e) => setReviewerId(e.target.value)} placeholder="user public_id" />
              </div>
              <div>
                <div className="mb-1 text-xs text-zinc-400">Rating</div>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-zinc-400">Comments</div>
                <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Feedback…" />
              </div>
              <Button onClick={addReview} disabled={!hasToken || postingReview}>
                {postingReview ? (
                  <>
                    <Spinner /> Posting…
                  </>
                ) : (
                  "Post review"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>{reviews.length} total</CardDescription>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? <div className="text-sm text-zinc-400">No reviews yet.</div> : null}
              <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                {reviews.map((r) => (
                  <div key={r.id} className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium">Reviewer: {r.reviewer_id}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={r.rating >= 4 ? "success" : "warning"}>rating: {r.rating}</Badge>
                        <div className="text-xs text-zinc-500">{formatDateTime(r.created_at)}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-zinc-200 whitespace-pre-wrap">{r.comments || "—"}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add comment</CardTitle>
              <CardDescription>POST /api/papers/{params.id}/comments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-1 text-xs text-zinc-400">User ID</div>
                <Input value={commentUserId} onChange={(e) => setCommentUserId(e.target.value)} placeholder="user public_id" />
              </div>
              <div>
                <div className="mb-1 text-xs text-zinc-400">Body</div>
                <Textarea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} placeholder="Write a comment…" />
              </div>
              <Button onClick={addComment} disabled={!hasToken || postingComment}>
                {postingComment ? (
                  <>
                    <Spinner /> Posting…
                  </>
                ) : (
                  "Post comment"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>{comments.length} total</CardDescription>
            </CardHeader>
            <CardContent>
              {comments.length === 0 ? <div className="text-sm text-zinc-400">No comments yet.</div> : null}
              <div className="mt-3 space-y-2">
                {comments.map((c) => (
                  <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium">{c.user_id}</div>
                      <div className="text-xs text-zinc-500">{formatDateTime(c.created_at)}</div>
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-200">{c.body}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
