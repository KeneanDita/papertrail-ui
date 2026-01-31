"use client";

import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getEffectiveApiBaseUrl, getStoredApiBaseUrl, getStoredToken, setStoredApiBaseUrl, setStoredToken } from "@/lib/settings";

export default function SettingsPage() {
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [token, setToken] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setApiBaseUrl(getStoredApiBaseUrl());
    setToken(getStoredToken());
  }, []);

  const effectiveBase = useMemo(() => getEffectiveApiBaseUrl(), [savedAt]);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure the API base URL and JWT token used for protected endpoints."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Base URL</CardTitle>
            <CardDescription>
              Optional override stored in your browser. If blank, uses `NEXT_PUBLIC_API_BASE_URL`.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="http://localhost:8080"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setStoredApiBaseUrl(apiBaseUrl);
                  setSavedAt(Date.now());
                }}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setApiBaseUrl("");
                  setStoredApiBaseUrl("");
                  setSavedAt(Date.now());
                }}
              >
                Clear override
              </Button>
            </div>
            <div className="text-xs text-zinc-400">Effective base URL: {effectiveBase}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JWT Bearer Token</CardTitle>
            <CardDescription>
              This API expects `Authorization: Bearer &lt;token&gt;` for papers/reviews/comments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste JWT here"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setStoredToken(token);
                  setSavedAt(Date.now());
                }}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setToken("");
                  setStoredToken("");
                  setSavedAt(Date.now());
                }}
              >
                Clear
              </Button>
            </div>
            <div className="text-xs text-zinc-400">
              Tip: If your UI is hosted on a different domain than the API, set `CORS_ALLOW_ORIGINS` on the Go backend.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
