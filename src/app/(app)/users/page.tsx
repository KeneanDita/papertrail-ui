"use client";

import { useEffect, useMemo, useState } from "react";

import { apiRequest, ApiError } from "@/lib/api";
import type { User } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [creating, setCreating] = useState(false);

  const sorted = useMemo(() => users.slice(), [users]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<User[]>("/api/users");
      setUsers(data);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createUser() {
    setCreating(true);
    setError("");
    try {
      await apiRequest<User>("/api/users", {
        method: "POST",
        body: { email, role },
      });
      setEmail("");
      setRole("user");
      await load();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Users"
        description="Public endpoints in this API (used for easy bootstrapping)."
        actions={
          <Button variant="secondary" onClick={load} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create user</CardTitle>
            <CardDescription>
              Role assignment is only honored if the request is made by an admin token; otherwise it defaults to `user`.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="mb-1 text-xs text-zinc-400">Email</div>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@domain.com" />
            </div>
            <div>
              <div className="mb-1 text-xs text-zinc-400">Role</div>
              <select
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <Button onClick={createUser} disabled={creating || !email.trim()}>
              {creating ? (
                <>
                  <Spinner className="h-4 w-4" /> Creating…
                </>
              ) : (
                "Create"
              )}
            </Button>
            {error ? <div className="text-sm text-red-300">{error}</div> : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All users</CardTitle>
            <CardDescription>{users.length} total</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Spinner /> Loading…
              </div>
            ) : null}
            {!loading && sorted.length === 0 ? (
              <div className="text-sm text-zinc-400">No users yet.</div>
            ) : null}

            <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
              {sorted.map((u) => (
                <div key={u.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium">{u.email}</div>
                    <div className="mt-1 text-xs text-zinc-400">id: {u.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === "admin" ? "warning" : "neutral"}>{u.role}</Badge>
                    <div className="text-xs text-zinc-400">{formatDateTime(u.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
