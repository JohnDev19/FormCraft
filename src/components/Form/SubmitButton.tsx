"use client";

import React from "react";
import { cn } from "../../utils";

export interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variantClasses = {
  primary:
    "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-transparent focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
  secondary:
    "bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border-gray-300 focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700",
  destructive:
    "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-transparent focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
  ghost:
    "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 border-transparent focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800",
};

const sizeClasses = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

/**
 * SubmitButton — form submit button with built-in loading state.
 *
 * @example
 * <SubmitButton loading={form.formState.isSubmitting} loadingText="Signing in...">
 *   Sign in
 * </SubmitButton>
 */
export function SubmitButton({
  loading = false,
  loadingText = "Loading...",
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        "formcraft-submit",
        "inline-flex items-center justify-center rounded-md border font-medium",
        "transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
        "select-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg
            aria-hidden="true"
            className={cn(
              "animate-spin text-current shrink-0",
              size === "sm" ? "h-3 w-3" : "h-4 w-4"
            )}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

SubmitButton.displayName = "FormCraft.SubmitButton";

/**
 * FormActions — container for form action buttons (e.g., Submit + Cancel).
 */
export function FormActions({
  children,
  className,
  align = "right",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center" | "stretch";
}) {
  return (
    <div
      className={cn(
        "formcraft-form-actions flex items-center gap-3 pt-2",
        align === "right" && "justify-end",
        align === "left" && "justify-start",
        align === "center" && "justify-center",
        align === "stretch" && "flex-col",
        className
      )}
    >
      {children}
    </div>
  );
}

FormActions.displayName = "FormCraft.FormActions";
