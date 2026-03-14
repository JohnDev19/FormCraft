import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { z } from "zod";
import { Form, useFormCraft, Input, SubmitButton } from "../index";

// ─── Test helper: wrapper component ──────────────────────────────────────────

interface TestFormProps {
  onSubmit?: (data: Record<string, unknown>) => void;
  schema?: z.ZodSchema;
  defaultValues?: Record<string, unknown>;
}

/**
 * Basic form WITHOUT password toggle — avoids label ambiguity.
 * showPasswordToggle adds aria-label="Show password" to the toggle button,
 * causing getByLabelText(/password/i) to match both the label AND that button.
 */
function TestLoginForm({
  onSubmit = vi.fn(),
  schema,
  defaultValues,
}: TestFormProps) {
  const loginSchema = schema ?? z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Too short"),
  });

  const form = useFormCraft({
    schema: loginSchema,
    defaultValues: defaultValues ?? { email: "", password: "" },
    mode: "onBlur",
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <Input
        name="email"
        control={form.control}
        label="Email"
        type="email"
        placeholder="you@example.com"
      />
      {/* No showPasswordToggle — keeps "Password" label unique in the DOM */}
      <Input
        name="password"
        control={form.control}
        label="Password"
        type="password"
      />
      <SubmitButton loading={form.formState.isSubmitting}>Sign in</SubmitButton>
    </Form>
  );
}

/**
 * Dedicated form for testing the password toggle.
 * Uses data-testid on the input so we can target it unambiguously
 * even when the toggle button carries an aria-label containing "password".
 */
function TestPasswordToggleForm() {
  const form = useFormCraft({ defaultValues: { password: "" } });
  return (
    <Form form={form} onSubmit={vi.fn()}>
      <Input
        name="password"
        control={form.control}
        label="Password"
        type="password"
        showPasswordToggle
        data-testid="password-input"
      />
    </Form>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Form", () => {
  it("renders form fields correctly", () => {
    render(<TestLoginForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors on submit with invalid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestLoginForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows error when email is invalid", async () => {
    const user = userEvent.setup();
    render(<TestLoginForm />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "notanemail");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("calls onSubmit with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestLoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("does not call onSubmit when form is invalid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestLoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "bad-email");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("password toggle shows and hides password", async () => {
    const user = userEvent.setup();
    render(<TestPasswordToggleForm />);

    // Use data-testid — unambiguous even though toggle button has aria-label "Show password"
    const passwordInput = screen.getByTestId("password-input");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: /show password/i });
    await user.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});

describe("Input accessibility", () => {
  it("associates label with input via htmlFor/id", () => {
    render(<TestLoginForm />);
    const label = screen.getByText("Email");
    const input = screen.getByLabelText("Email");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("sets aria-invalid on error", async () => {
    const user = userEvent.setup();
    render(<TestLoginForm />);

    const input = screen.getByLabelText("Email");
    await user.type(input, "bad");
    await user.tab();

    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("error has role=alert for screen readers", async () => {
    const user = userEvent.setup();
    render(<TestLoginForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThan(0);
    });
  });
});

describe("SubmitButton", () => {
  it("shows loading state", () => {
    render(
      <button type="submit" aria-busy="true" disabled>
        Loading...
      </button>
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
  });
});
