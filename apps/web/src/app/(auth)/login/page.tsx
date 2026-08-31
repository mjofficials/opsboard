"use client"

import { AppForm } from "@/components/form/AppForm";
import { AppInput } from "@/components/form/inputs/AppInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (data: LoginFormValues) => {
    const { error: loginError } = await login(data.email, data.password);
    if (!loginError) {
      router.push("/dashboard");
    }
  }

  return (
    <Card className="w-full border-0 shadow-xl dark:border-zinc-800 sm:border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Sign in</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account
        </CardDescription>
        {error && (
          <div className="p-3 mt-3 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
      </CardHeader>

      {/* Form */}
      <AppForm<LoginFormValues>
        schema={loginSchema}
        onSubmit={handleLogin}
        defaultValues={{ email: "", password: "" }}
      >
        <CardContent className="space-y-4">
          <AppInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            disabled={isLoading}
          />
          <div className="relative mb-4">
            <AppInput
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <Link
              href="#"
              className="absolute right-0 -top-1.5 text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full text-md h-11" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </AppForm>

    </Card>
  );
}
