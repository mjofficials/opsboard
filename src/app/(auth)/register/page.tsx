"use client"

import { AppForm } from "@/components/form/AppForm";
import { AppInput } from "@/components/form/inputs/AppInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();

  const handleRegister = async (data: RegisterFormValues) => {
    const { error: registerError } = await register(data.name, data.email, data.password);

    if (!registerError) {
      router.push("/onboarding");
    }
  }

  return (
    <Card className="w-full border-0 shadow-xl dark:border-zinc-800 sm:border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your details below to create your account
        </CardDescription>
        {error && (
          <div className="p-3 mt-3 text-sm text-red-500 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
      </CardHeader>

      {/* SignUP Form */}
      <AppForm<RegisterFormValues>
        schema={registerSchema}
        onSubmit={handleRegister}
        defaultValues={{ name: "", email: "", password: "" }}
      >
        <CardContent className="space-y-4">
          <AppInput
            name="name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          <AppInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            disabled={isLoading}
          />
          <AppInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button type="submit" className="w-full text-md h-11" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </AppForm>

    </Card>
  );
}
