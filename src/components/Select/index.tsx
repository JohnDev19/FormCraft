"use client";

import React, { useId } from "react";
import { Controller, FieldValues, FieldPath, Control } from "react-hook-form";
import { FieldWrapper } from "../Form/FieldWrapper";
import { cn } from "../../utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface SelectProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

/**
 * Select — accessible native select with styled wrapper.
 *
 * @example
 * <Select
 *   name="country"
 *   control={form.control}
 *   label="Country"
 *   placeholder="Select a country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *   ]}
 * />
 */
export function Select<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  options,
  placeholder,
  className,
  wrapperClassName,
  required,
  disabled,
  ...props
}: SelectProps<TFieldValues>) {
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
            <select
              {...field}
              {...props}
              id={id}
              disabled={disabled}
              aria-invalid={!!fieldState.error}
              aria-describedby={
                fieldState.error ? `${id}-error` : description ? `${id}-desc` : undefined
              }
              className={cn(
                "formcraft-select",
                "w-full appearance-none rounded-md border bg-white dark:bg-gray-900",
                "text-sm text-gray-900 dark:text-gray-100",
                "pl-3 pr-9 py-2.5",
                "transition-all duration-150 cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "dark:focus:ring-blue-400 dark:focus:border-blue-400",
                "border-gray-300 dark:border-gray-600",
                fieldState.error &&
                  "border-red-400 dark:border-red-500 focus:ring-red-400 focus:border-red-400",
                disabled && "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800",
                !field.value && "text-gray-400 dark:text-gray-500",
                className
              )}
            >
              {placeholder && (
                <option value="" disabled hidden>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* Custom chevron */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </FieldWrapper>
      )}
    />
  );
}

Select.displayName = "FormCraft.Select";
