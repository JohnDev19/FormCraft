"use client";

import React, { useId, useEffect, useRef } from "react";
import { Controller, FieldValues, FieldPath, Control } from "react-hook-form";
import { FieldWrapper } from "../Form/FieldWrapper";
import { cn } from "../../utils";

export interface TextareaProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  showCount?: boolean;
  autoResize?: boolean;
  wrapperClassName?: string;
}

/**
 * Textarea — accessible textarea with optional character counter and auto-resize.
 *
 * @example
 * <Textarea
 *   name="message"
 *   control={form.control}
 *   label="Message"
 *   placeholder="Tell us something..."
 *   showCount
 *   maxLength={500}
 *   autoResize
 * />
 */
export function Textarea<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  showCount = false,
  autoResize = false,
  maxLength,
  className,
  wrapperClassName,
  required,
  disabled,
  rows = 4,
  ...props
}: TextareaProps<TFieldValues>) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentLength = (field.value as string)?.length ?? 0;
        const isNearLimit = maxLength && currentLength >= maxLength * 0.8;
        const isAtLimit = maxLength && currentLength >= maxLength;

        // Auto-resize logic
        function handleAutoResize(el: HTMLTextAreaElement) {
          if (!autoResize) return;
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        }

        return (
          <FieldWrapper
            label={label}
            description={description}
            error={fieldState.error?.message}
            required={required}
            htmlFor={id}
            className={wrapperClassName}
          >
            <div className="relative">
              <textarea
                {...field}
                {...props}
                id={id}
                rows={autoResize ? 2 : rows}
                maxLength={maxLength}
                disabled={disabled}
                aria-invalid={!!fieldState.error}
                aria-describedby={
                  [
                    fieldState.error ? `${id}-error` : undefined,
                    description ? `${id}-desc` : undefined,
                    showCount ? `${id}-count` : undefined,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                onChange={(e) => {
                  field.onChange(e);
                  handleAutoResize(e.target);
                }}
                ref={(el) => {
                  field.ref(el);
                  (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
                  if (el && autoResize) handleAutoResize(el);
                }}
                className={cn(
                  "formcraft-textarea",
                  "w-full rounded-md border bg-white dark:bg-gray-900",
                  "text-sm text-gray-900 dark:text-gray-100",
                  "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                  "px-3 py-2.5",
                  "resize-none transition-all duration-150",
                  autoResize && "overflow-hidden",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  "dark:focus:ring-blue-400 dark:focus:border-blue-400",
                  "border-gray-300 dark:border-gray-600",
                  fieldState.error &&
                    "border-red-400 dark:border-red-500 focus:ring-red-400 focus:border-red-400",
                  disabled && "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800",
                  showCount && "pb-8",
                  className
                )}
              />

              {showCount && maxLength && (
                <div
                  id={`${id}-count`}
                  aria-live="polite"
                  className={cn(
                    "absolute bottom-2.5 right-3 text-xs tabular-nums select-none transition-colors",
                    isAtLimit
                      ? "text-red-500 font-semibold"
                      : isNearLimit
                      ? "text-orange-500"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {currentLength}/{maxLength}
                </div>
              )}
            </div>
          </FieldWrapper>
        );
      }}
    />
  );
}

Textarea.displayName = "FormCraft.Textarea";
