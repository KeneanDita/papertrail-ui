"use client";

import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RequireToken({
  hasToken,
  title = "JWT required",
  description = "This endpoint is protected. Add a Bearer token in Settings to continue.",
}: {
  hasToken: boolean;
  title?: string;
  description?: string;
}) {
  if (hasToken) return null;

  return (
    <Alert>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description} <Link className="underline underline-offset-4" href="/settings">Go to Settings</Link>.
      </AlertDescription>
    </Alert>
  );
}
