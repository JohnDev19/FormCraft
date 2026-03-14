"use client";

import React, { useId } from "react";
import { Controller, FieldValues, FieldPath, Control } from "react-hook-form";
import { FieldWrapper } from "../Form/FieldWrapper";
import { cn } from "../../utils";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface RadioGroupProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  wrapperClassName?: string;
}

/**
 * RadioGroup — accessible radio button group.
 *
 * @example
 * <RadioGroup
 *   name="plan"
 *   control={form.control}
 *   label="Plan"
 *   options={[
 *     { value: 'free', label: 'Free', description: 'Up to 3 projects' },
 *     { value: 'pro', label: 'Pro', description: 'Unlimited projects' },
 *   ]}
 * />
 */
export function RadioGroup<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  options,
  orientation = "vertical",
  wrapperClassName,
}: RadioGroupProps<TFieldValues>) {
  const groupId = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldWrapper
          label={label}
          description={description}
          error={fieldState.error?.message}
          htmlFor={groupId}
          className={wrapperClassName}
        >
          <div
            role="radiogroup"
            aria-labelledby={label ? `${groupId}-label` : undefined}
            aria-describedby={
              fieldState.error ? `${groupId}-error` : undefined
            }
            className={cn(
              "formcraft-radio-group flex gap-3",
              orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
            )}
          >
            {options.map((option) => {
              const optionId = `${groupId}-${option.value}`;
              const isSelected = field.value === option.value;

              return (
                <label
                  key={option.value}
                  htmlFor={optionId}
                  className={cn(
                    "formcraft-radio-option",
                    "flex items-start gap-2.5 cursor-pointer select-none",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      id={optionId}
                      type="radio"
                      name={name}
                      value={option.value}
                      checked={isSelected}
                      onChange={() => field.onChange(option.value)}
                      onBlur={field.onBlur}
                      disabled={option.disabled}
                      aria-invalid={!!fieldState.error}
                      className={cn(
                        "formcraft-radio",
                        "h-4 w-4 rounded-full border-2 transition-all duration-150 cursor-pointer",
                        "appearance-none",
                        "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                        "checked:border-blue-600 checked:bg-blue-600",
                        "dark:checked:border-blue-500 dark:checked:bg-blue-500",
                        fieldState.error && "border-red-400 dark:border-red-500",
                        option.disabled && "cursor-not-allowed"
                      )}
                    />
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="absolute h-1.5 w-1.5 rounded-full bg-white pointer-events-none"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-snug">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </FieldWrapper>
      )}
    />
  );
}

RadioGroup.displayName = "FormCraft.RadioGroup";
