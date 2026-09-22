"use client"

import { AppForm } from "@/components/form/AppForm";
import { AppInput } from "@/components/form/inputs/AppInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { teamService } from "@/features/teams/services/teamService";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function InviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No invitation token found in URL.");
    }
  }, [token]);

  const handleRegisterAndAccept = async (data: RegisterFormValues) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    // 1. Register User
    const { error: registerError } = await register(data.name, data.email, data.password);
    
    // If error isn't explicitly null, it failed. (Often returns string or object)
    if (registerError && (typeof registerError === 'string' || Object.keys(registerError).length > 0)) {
      setError(typeof registerError === 'string' ? registerError : (registerError as any).message || "Registration failed.");
      setIsLoading(false);
      return;
    }

    // 2. Accept Invite
    try {
      await teamService.acceptInviteByToken(token);
      toast.success("Invitation accepted successfully!");
      // Force reload to update session/dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to accept invite. Please ensure you used the invited email address.");
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full border-0 shadow-xl dark:border-zinc-800 sm:border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Accept Invitation</CardTitle>
        <CardDescription className="text-center">
          Create an account to join the organization.
        </CardDescription>
        {error && (
          <div className="p-3 mt-3 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
      </CardHeader>

      <AppForm<RegisterFormValues>
        schema={registerSchema}
        onSubmit={handleRegisterAndAccept}
        defaultValues={{ name: "", email: "", password: "" }}
      >
        <CardContent className="space-y-4">
          <AppInput
            name="name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            disabled={isLoading || !token}
          />
          <AppInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter the email address you were invited with"
            disabled={isLoading || !token}
          />
          <AppInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            disabled={isLoading || !token}
          />
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button type="submit" className="w-full text-md h-11" disabled={isLoading || !token}>
            {isLoading ? "Joining..." : "Create Account & Join"}
          </Button>
        </CardFooter>
      </AppForm>
    </Card>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center animate-pulse">Loading invitation...</div>}>
      <InviteForm />
    </Suspense>
  );
}
