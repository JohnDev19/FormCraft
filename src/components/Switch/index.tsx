"use client";

import React, { useId } from "react";
import { Controller, FieldValues, FieldPath, Control } from "react-hook-form";
import { cn } from "../../utils";

export interface SwitchProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  description?: string;
  wrapperClassName?: string;
}

/**
 * Switch — accessible toggle switch.
 *
 * @example
 * <Switch
 *   name="notifications"
 *   control={form.control}
 *   label="Email notifications"
 *   description="Receive weekly digest emails"
 * />
 */
export function Switch<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  className,
  wrapperClassName,
  disabled,
  ...props
}: SwitchProps<TFieldValues>) {
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div
          className={cn(
            "formcraft-switch-wrapper",
            "flex items-start justify-between gap-4",
            wrapperClassName
          )}
        >
          <div className="flex flex-col gap-0.5 flex-1">
            <label
              htmlFor={id}
              className={cn(
                "text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none",
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
            {fieldState.error && (
              <p
                role="alert"
                aria-live="polite"
                className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-medium mt-0.5"
              >
                {fieldState.error.message}
              </p>
            )}
          </div>

          {/* Switch track */}
          <button
            id={id}
            type="button"
            role="switch"
            aria-checked={!!field.value}
            aria-labelledby={id}
            aria-describedby={description ? `${id}-desc` : undefined}
            disabled={disabled}
            onClick={() => field.onChange(!field.value)}
            onBlur={field.onBlur}
            className={cn(
              "formcraft-switch",
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
              "transition-colors duration-200 ease-in-out",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900",
              field.value
                ? "bg-blue-600 dark:bg-blue-500"
                : "bg-gray-200 dark:bg-gray-700",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm",
                "transform transition-transform duration-200 ease-in-out",
                field.value ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      )}
    />
  );
}

Switch.displayName = "FormCraft.Switch";
