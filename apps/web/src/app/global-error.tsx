"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-muted-foreground mb-8">
          A critical error occurred. Please try again or contact support.
        </p>
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
      </body>
    </html>
  );
}
