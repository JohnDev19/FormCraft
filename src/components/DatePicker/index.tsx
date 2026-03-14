"use client";

import React, { useId } from "react";
import { Controller, FieldValues, FieldPath, Control } from "react-hook-form";
import { FieldWrapper } from "../Form/FieldWrapper";
import { cn } from "../../utils";

export interface DatePickerProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  minDate?: string; // "YYYY-MM-DD"
  maxDate?: string;
  wrapperClassName?: string;
}

/**
 * DatePicker — accessible native date input with calendar icon.
 *
 * @example
 * <DatePicker
 *   name="birthDate"
 *   control={form.control}
 *   label="Date of Birth"
 *   maxDate={new Date().toISOString().split("T")[0]}
 * />
 */
export function DatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  minDate,
  maxDate,
  className,
  wrapperClassName,
  required,
  disabled,
  ...props
}: DatePickerProps<TFieldValues>) {
  const id = useId();

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
          <div className="relative">
            <input
              {...field}
              {...props}
              id={id}
              type="date"
              min={minDate}
              max={maxDate}
              disabled={disabled}
              aria-invalid={!!fieldState.error}
              aria-describedby={
                fieldState.error
                  ? `${id}-error`
                  : description
                  ? `${id}-desc`
                  : undefined
              }
              className={cn(
                "formcraft-input",
                "w-full rounded-md border bg-white dark:bg-gray-900",
                "text-sm text-gray-900 dark:text-gray-100",
                "pl-3 pr-10 py-2.5",
                "transition-all duration-150 cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "dark:focus:ring-blue-400 dark:focus:border-blue-400",
                "border-gray-300 dark:border-gray-600",
                fieldState.error &&
                  "border-red-400 dark:border-red-500 focus:ring-red-400 focus:border-red-400",
                disabled && "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800",
                className
              )}
            />
            {/* Calendar icon overlay (purely decorative) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
        </FieldWrapper>
      )}
    />
  );
}

DatePicker.displayName = "FormCraft.DatePicker";
