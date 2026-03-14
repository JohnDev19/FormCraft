import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
      <Input
        name="password"
        control={form.control}
        label="Password"
        type="password"
        showPasswordToggle
      />
      <SubmitButton loading={form.formState.isSubmitting}>Sign in</SubmitButton>
    </Form>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Form", () => {
  it("renders form fields correctly", () => {
    render(<TestLoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
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

    const emailInput = screen.getByLabelText(/email/i);
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

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
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

    await user.type(screen.getByLabelText(/email/i), "bad-email");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("password toggle shows and hides password", async () => {
    const user = userEvent.setup();
    render(<TestLoginForm />);

    const passwordInput = screen.getByLabelText(/password/i);
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
    const input = screen.getByLabelText(/email/i);
    expect(label).toHaveAttribute("for", input.id);
  });

  it("sets aria-invalid on error", async () => {
    const user = userEvent.setup();
    render(<TestLoginForm />);

    const input = screen.getByLabelText(/email/i);
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
