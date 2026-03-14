"use client";

/**
 * examples/LoginForm.tsx
 *
 * A complete login form using FormCraft.
 * Copy this into your Next.js app as a starting point.
 *
 * Usage:
 *   import LoginForm from "@/components/LoginForm";
 *   <LoginForm onSuccess={() => router.push("/dashboard")} />
 */

import React from "react";
import {
  Form,
  Input,
  Checkbox,
  SubmitButton,
  FormActions,
  useFormCraft,
  loginSchema,
  type LoginFormValues,
} from "formcraft";

interface LoginFormProps {
  onSuccess?: (data: LoginFormValues) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const form = useFormCraft<LoginFormValues>({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function handleSubmit(data: LoginFormValues) {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Login data:", data);
    onSuccess?.(data);
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Enter your credentials below.
        </p>
      </div>

      <Form form={form} onSubmit={handleSubmit} className="fc-spaced">
        <Input
          name="email"
          control={form.control}
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          leftIcon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <Input
          name="password"
          control={form.control}
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          showPasswordToggle
        />

        <div className="flex items-center justify-between">
          <Checkbox
            name="rememberMe"
            control={form.control}
            label="Remember me"
          />
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <FormActions align="stretch">
          <SubmitButton
            loading={form.formState.isSubmitting}
            loadingText="Signing in..."
            fullWidth
          >
            Sign in
          </SubmitButton>
        </FormActions>
      </Form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline font-medium">
          Create one
        </a>
      </p>
    </div>
  );
}
