"use client";

/**
 * examples/MultiStepForm.tsx
 *
 * A 3-step onboarding form demonstrating useMultiStepForm.
 */

import React from "react";
import { z } from "zod";
import {
  Form,
  Input,
  Select,
  Textarea,
  RadioGroup,
  Switch,
  SubmitButton,
  useFormCraft,
  useMultiStepForm,
  requiredString,
  emailSchema,
} from "formcraft";

const onboardingSchema = z.object({
  // Step 1 — Personal info
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  email: emailSchema,

  // Step 2 — Role & team
  role: z.string().min(1, "Please select a role"),
  teamSize: z.string().min(1, "Please select a team size"),
  useCase: z.string().min(10, "Please describe your use case (min 10 chars)"),

  // Step 3 — Preferences
  plan: z.enum(["free", "pro", "enterprise"], {
    required_error: "Please select a plan",
  }),
  emailUpdates: z.boolean().optional(),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

const STEPS = ["Personal Info", "Your Role", "Preferences"];

export default function MultiStepForm() {
  const { step, totalSteps, next, back, isFirst, isLast, progress } =
    useMultiStepForm({ steps: STEPS.length });

  const form = useFormCraft<OnboardingValues>({
    schema: onboardingSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      teamSize: "",
      useCase: "",
      plan: "free",
      emailUpdates: true,
    },
    mode: "onBlur",
  });

  async function handleSubmit(data: OnboardingValues) {
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Onboarding complete:", data);
    alert("Welcome aboard! 🎉");
  }

  const stepFields: Record<number, (keyof OnboardingValues)[]> = {
    0: ["firstName", "lastName", "email"],
    1: ["role", "teamSize", "useCase"],
    2: ["plan"],
  };

  async function handleNext() {
    const valid = await form.trigger(stepFields[step]);
    if (valid) next();
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={i <= step ? "text-blue-600 font-medium" : ""}
            >
              {s}
            </span>
          ))}
        </div>
        <div
          className="h-1.5 bg-gray-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${step + 1} of ${totalSteps}`}
        >
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Form form={form} onSubmit={handleSubmit} className="fc-spaced">
        {/* ─── Step 0: Personal Info ─────────────────────────────────── */}
        {step === 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900">
              Tell us about yourself
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                control={form.control}
                label="First name"
                placeholder="Alice"
                required
              />
              <Input
                name="lastName"
                control={form.control}
                label="Last name"
                placeholder="Johnson"
                required
              />
            </div>
            <Input
              name="email"
              control={form.control}
              label="Work email"
              type="email"
              placeholder="alice@company.com"
              required
            />
          </>
        )}

        {/* ─── Step 1: Role & Team ───────────────────────────────────── */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900">
              Your role & team
            </h2>
            <Select
              name="role"
              control={form.control}
              label="Your role"
              placeholder="Select your role"
              required
              options={[
                { value: "engineer", label: "Software Engineer" },
                { value: "designer", label: "Designer" },
                { value: "pm", label: "Product Manager" },
                { value: "founder", label: "Founder / CEO" },
                { value: "other", label: "Other" },
              ]}
            />
            <Select
              name="teamSize"
              control={form.control}
              label="Team size"
              placeholder="How many people?"
              options={[
                { value: "1", label: "Just me" },
                { value: "2-10", label: "2–10 people" },
                { value: "11-50", label: "11–50 people" },
                { value: "51+", label: "51+ people" },
              ]}
            />
            <Textarea
              name="useCase"
              control={form.control}
              label="What will you use FormCraft for?"
              placeholder="We're building a complex multi-step wizard for..."
              required
              showCount
              maxLength={300}
              autoResize
            />
          </>
        )}

        {/* ─── Step 2: Plan ──────────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900">
              Choose a plan
            </h2>
            <RadioGroup
              name="plan"
              control={form.control}
              label="Plan"
              options={[
                {
                  value: "free",
                  label: "Free",
                  description: "Up to 3 forms. Perfect for side projects.",
                },
                {
                  value: "pro",
                  label: "Pro — $12/mo",
                  description: "Unlimited forms, analytics, and priority support.",
                },
                {
                  value: "enterprise",
                  label: "Enterprise",
                  description: "Custom limits, SSO, and a dedicated account manager.",
                },
              ]}
            />
            <Switch
              name="emailUpdates"
              control={form.control}
              label="Product updates"
              description="Get notified about new features and improvements."
            />
          </>
        )}

        {/* ─── Navigation ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          {!isFirst ? (
            <button
              type="button"
              onClick={back}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          {isLast ? (
            <SubmitButton
              loading={form.formState.isSubmitting}
              loadingText="Finishing up..."
            >
              Complete setup →
            </SubmitButton>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue →
            </button>
          )}
        </div>
      </Form>
    </div>
  );
}
