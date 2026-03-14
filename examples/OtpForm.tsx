"use client";

/**
 * examples/OtpForm.tsx
 *
 * OTP verification form using PinInput + FormAlert.
 */

import React, { useState } from "react";
import { z } from "zod";
import {
  Form,
  PinInput,
  SubmitButton,
  FormAlert,
  useFormCraft,
} from "formcraft";

const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Please enter the full 6-digit code")
    .regex(/^\d+$/, "Code must be digits only"),
});

type OtpValues = z.infer<typeof otpSchema>;

export default function OtpForm({ email = "a***@example.com" }: { email?: string }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const form = useFormCraft<OtpValues>({
    schema: otpSchema,
    defaultValues: { code: "" },
    mode: "onSubmit",
  });

  async function handleSubmit(data: OtpValues) {
    setError(null);
    await new Promise((r) => setTimeout(r, 1000));
    if (data.code !== "123456") {
      setError("That code is incorrect or has expired. Please try again.");
      form.reset();
      return;
    }
    setSuccess(true);
  }

  async function handleResend() {
    setResent(true);
    await new Promise((r) => setTimeout(r, 800));
    setTimeout(() => setResent(false), 5000);
  }

  if (success) {
    return (
      <div className="text-center space-y-3 py-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-100 text-green-600">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Verified!</h2>
        <p className="text-sm text-gray-500">Your identity has been confirmed.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
        <p className="text-sm text-gray-500">
          We sent a 6-digit code to <strong className="font-medium text-gray-700">{email}</strong>
        </p>
      </div>

      {error && (
        <FormAlert
          variant="error"
          message={error}
          onDismiss={() => setError(null)}
          className="mb-5 text-left"
        />
      )}

      <Form form={form} onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-5">
          <PinInput
            name="code"
            control={form.control}
            length={6}
            description="Enter the code from your inbox"
            required
          />

          <SubmitButton
            loading={form.formState.isSubmitting}
            loadingText="Verifying..."
            fullWidth
          >
            Verify code
          </SubmitButton>
        </div>
      </Form>

      <p className="text-sm text-gray-500 mt-5">
        Didn&apos;t receive it?{" "}
        <button
          type="button"
          disabled={resent}
          onClick={handleResend}
          className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {resent ? "Code sent ✓" : "Resend code"}
        </button>
      </p>
    </div>
  );
}
