"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, session, isLoading, createOrganization } = useAuth();
  const [orgName, setOrgName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Route guard — only fires once auth status is resolved
  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (user?.organization_id) {
      router.replace("/dashboard");
    }
  }, [session, user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    setSubmitting(true);
    setError(null);

    const result = await createOrganization(orgName.trim());

    if (result?.error) {
      setError(
        (result.error as Error).message ||
          "Failed to create organization. Please try again."
      );
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
  };

  // Render nothing while auth resolves or a redirect is in flight
  if (isLoading || !session || user?.organization_id) {
    return null;
  }

  return (
    <Card className="w-full border-0 shadow-xl dark:border-zinc-800 sm:border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Welcome! 👋
        </CardTitle>
        <CardDescription className="text-center">
          Create your first organization to get started.
        </CardDescription>
        {error && (
          <div className="p-3 mt-3 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Acme Corp"
              disabled={submitting}
              autoFocus
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button
            type="submit"
            className="w-full text-md h-11"
            disabled={!orgName.trim() || submitting}
          >
            {submitting ? "Creating..." : "Create Organization"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
