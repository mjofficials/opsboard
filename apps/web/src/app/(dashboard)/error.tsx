"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error Caught:", error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-destructive/20 bg-destructive/5">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2 text-destructive">Dashboard Error</h2>
      <p className="text-muted-foreground mb-6 max-w-md text-sm">
        We encountered a problem loading this part of the dashboard.
      </p>
      <Button onClick={() => reset()} variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
        Retry Loading
      </Button>
    </div>
  );
}
