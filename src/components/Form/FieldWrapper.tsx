"use client";

import React from "react";
import { cn } from "../../utils";

export interface FieldWrapperProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

/**
 * FieldWrapper — shared wrapper for all FormCraft fields.
 * Renders label, description, children, and error messages with full accessibility.
 */
export function FieldWrapper({
  label,
  description,
  error,
  required,
  children,
  className,
  htmlFor,
}: FieldWrapperProps) {
  const descriptionId = description ? `${htmlFor}-desc` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div
      className={cn("formcraft-field", "flex flex-col gap-1.5 w-full", className)}
      data-error={!!error}
    >
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(
            "formcraft-label",
            "text-sm font-medium text-gray-700 dark:text-gray-300 select-none",
            required &&
              "after:content-['*'] after:ml-0.5 after:text-red-500 after:font-normal"
          )}
        >
          {label}
        </label>
      )}

      {description && (
        <p
          id={descriptionId}
          className="formcraft-description text-xs text-gray-500 dark:text-gray-400 -mt-0.5"
        >
          {description}
        </p>
      )}

      <div
        className="formcraft-control relative"
        aria-describedby={
          [descriptionId, errorId].filter(Boolean).join(" ") || undefined
        }
      >
        {children}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className={cn(
            "formcraft-error",
            "flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-medium"
          )}
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
          {error}
        </p>
      )}
    </div>
  );
}

FieldWrapper.displayName = "FormCraft.FieldWrapper";
