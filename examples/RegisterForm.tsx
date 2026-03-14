"use client";

/**
 * examples/RegisterForm.tsx
 *
 * Registration form with password strength indicator and terms checkbox.
 */

import React from "react";
import {
  Form,
  Input,
  Checkbox,
  SubmitButton,
  FormActions,
  useFormCraft,
  usePasswordStrength,
  registerSchema,
  type RegisterFormValues,
} from "formcraft";

export default function RegisterForm() {
  const form = useFormCraft<RegisterFormValues>({
    schema: registerSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onChange",
  });

  const passwordValue = form.watch("password") ?? "";
  const strength = usePasswordStrength(passwordValue);

  async function handleSubmit(data: RegisterFormValues) {
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Registered:", data);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="text-sm text-gray-500 mt-1">Free forever. No credit card required.</p>
      </div>

      <Form form={form} onSubmit={handleSubmit} className="fc-spaced">
        <Input
          name="name"
          control={form.control}
          label="Full name"
          placeholder="Alice Johnson"
          autoComplete="name"
          required
        />

        <Input
          name="email"
          control={form.control}
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        {/* Password with strength indicator */}
        <div className="space-y-2">
          <Input
            name="password"
            control={form.control}
            label="Password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
            showPasswordToggle
          />

          {/* Strength bar */}
          {passwordValue && (
            <div aria-live="polite" className="space-y-1">
              <div className="flex gap-1" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={[
                      "h-1 flex-1 rounded-full transition-all duration-300",
                      i < strength.score
                        ? strength.score <= 1
                          ? "bg-red-400"
                          : strength.score <= 2
                          ? "bg-orange-400"
                          : strength.score <= 3
                          ? "bg-yellow-400"
                          : strength.score <= 4
                          ? "bg-blue-400"
                          : "bg-green-400"
                        : "bg-gray-200",
                    ].join(" ")}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${strength.color}`}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <Input
          name="confirmPassword"
          control={form.control}
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
          showPasswordToggle
        />

        <Checkbox
          name="acceptTerms"
          control={form.control}
          label="I agree to the Terms of Service and Privacy Policy"
          description="You must accept these to create an account."
        />

        <FormActions align="stretch">
          <SubmitButton
            loading={form.formState.isSubmitting}
            loadingText="Creating account..."
            fullWidth
          >
            Create account
          </SubmitButton>
        </FormActions>
      </Form>
    </div>
  );
}
