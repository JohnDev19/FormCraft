"use client";

import React, { useId } from "react";
import { Controller, FieldValues, FieldPath, Control } from "react-hook-form";
import { cn } from "../../utils";

export interface CheckboxProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  description?: string;
  wrapperClassName?: string;
}

/**
 * Checkbox — accessible checkbox with label and inline error.
 *
 * @example
 * <Checkbox
 *   name="acceptTerms"
 *   control={form.control}
 *   label="I agree to the Terms of Service"
 *   description="You must accept to continue"
 * />
 */
export function Checkbox<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  className,
  wrapperClassName,
  disabled,
  ...props
}: CheckboxProps<TFieldValues>) {
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("formcraft-checkbox-wrapper", "space-y-1", wrapperClassName)}>
          <div className="flex items-start gap-2.5">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                {...props}
                id={id}
                type="checkbox"
                checked={!!field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                disabled={disabled}
                aria-invalid={!!fieldState.error}
                aria-describedby={
                  [
                    fieldState.error ? `${id}-error` : undefined,
                    description ? `${id}-desc` : undefined,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                className={cn(
                  "formcraft-checkbox",
                  "peer h-4 w-4 shrink-0 rounded",
                  "border border-gray-300 dark:border-gray-600",
                  "bg-white dark:bg-gray-900",
                  "text-blue-600 dark:text-blue-500",
                  "transition-colors duration-150 cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                  "dark:focus:ring-blue-400",
                  "checked:bg-blue-600 checked:border-blue-600",
                  "dark:checked:bg-blue-500 dark:checked:border-blue-500",
                  fieldState.error &&
                    "border-red-400 dark:border-red-500 focus:ring-red-400",
                  disabled && "opacity-50 cursor-not-allowed",
                  className
                )}
              />
            </div>

            <div className="flex flex-col gap-0.5 flex-1">
              <label
                htmlFor={id}
                className={cn(
                  "text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none leading-snug",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {label}
              </label>

              {description && (
                <p
                  id={`${id}-desc`}
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          {fieldState.error && (
            <p
              id={`${id}-error`}
              role="alert"
              aria-live="polite"
              className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-medium ml-6"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

Checkbox.displayName = "FormCraft.Checkbox";
