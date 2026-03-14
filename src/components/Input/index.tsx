"use client";

import React, { useId, useState } from "react";
import { Controller, FieldValues, FieldPath, Control } from "react-hook-form";
import { FieldWrapper } from "../Form/FieldWrapper";
import { cn } from "../../utils";

export interface InputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  showPasswordToggle?: boolean;
  wrapperClassName?: string;
}

/**
 * Input — fully accessible form input with validation, icons, and password toggle.
 *
 * @example
 * <Input
 *   name="email"
 *   control={form.control}
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   leftIcon={<MailIcon />}
 * />
 */
export function Input<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  leftIcon,
  rightIcon,
  loading = false,
  showPasswordToggle = false,
  type = "text",
  className,
  wrapperClassName,
  required,
  disabled,
  placeholder,
  ...props
}: InputProps<TFieldValues>) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldWrapper
          label={label}
          description={description}
          error={fieldState.error?.message}
          required={required}
          htmlFor={id}
          className={wrapperClassName}
        >
          <div className="relative flex items-center">
            {leftIcon && (
              <span
                aria-hidden="true"
                className="absolute left-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none z-10"
              >
                {leftIcon}
              </span>
            )}

            <input
              {...field}
              {...props}
              id={id}
              type={inputType}
              placeholder={placeholder}
              disabled={disabled || loading}
              aria-invalid={!!fieldState.error}
              aria-describedby={
                fieldState.error ? `${id}-error` : description ? `${id}-desc` : undefined
              }
              className={cn(
                // Base
                "formcraft-input",
                "w-full rounded-md border bg-white dark:bg-gray-900",
                "text-sm text-gray-900 dark:text-gray-100",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                "transition-all duration-150",
                // Focus
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "dark:focus:ring-blue-400 dark:focus:border-blue-400",
                // Default border
                "border-gray-300 dark:border-gray-600",
                // Error state
                fieldState.error &&
                  "border-red-400 dark:border-red-500 focus:ring-red-400 dark:focus:ring-red-500 focus:border-red-400",
                // Disabled state
                (disabled || loading) &&
                  "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800",
                // Padding adjustments for icons
                leftIcon ? "pl-10" : "pl-3",
                rightIcon || (isPassword && showPasswordToggle) || loading
                  ? "pr-10"
                  : "pr-3",
                "py-2.5",
                className
              )}
            />

            {/* Right side: loading spinner, password toggle, or custom icon */}
            {loading ? (
              <span
                aria-label="Loading"
                className="absolute right-3 flex items-center"
              >
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
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
              </span>
            ) : isPassword && showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            ) : rightIcon ? (
              <span aria-hidden="true" className="absolute right-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
                {rightIcon}
              </span>
            ) : null}
          </div>
        </FieldWrapper>
      )}
    />
  );
}

Input.displayName = "FormCraft.Input";
