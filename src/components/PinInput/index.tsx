"use client";

import React, { useId, useRef, useCallback } from "react";
import { Controller, FieldValues, FieldPath, Control } from "react-hook-form";
import { FieldWrapper } from "../Form/FieldWrapper";
import { cn } from "../../utils";

export interface PinInputProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  length?: number; // number of digits, default 6
  label?: string;
  description?: string;
  mask?: boolean; // show dots instead of digits
  autoSubmit?: boolean; // call onChange when all digits filled
  wrapperClassName?: string;
  required?: boolean;
}

/**
 * PinInput — OTP / verification code input.
 * Handles paste, auto-advance, backspace navigation.
 *
 * @example
 * <PinInput
 *   name="otp"
 *   control={form.control}
 *   label="Verification code"
 *   description="Enter the 6-digit code sent to your email"
 *   length={6}
 * />
 */
export function PinInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  length = 6,
  label,
  description,
  mask = false,
  wrapperClassName,
  required,
}: PinInputProps<TFieldValues>) {
  const id = useId();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusNext = useCallback(
    (index: number) => {
      if (index < length - 1) inputsRef.current[index + 1]?.focus();
    },
    [length]
  );

  const focusPrev = useCallback((index: number) => {
    if (index > 0) inputsRef.current[index - 1]?.focus();
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // field.value is a string like "123456" or undefined
        const digits: string[] = Array.from(
          { length },
          (_, i) => (field.value as string)?.[i] ?? ""
        );

        function updateValue(index: number, char: string) {
          const arr = [...digits];
          arr[index] = char;
          field.onChange(arr.join(""));
        }

        function handleKeyDown(
          e: React.KeyboardEvent<HTMLInputElement>,
          index: number
        ) {
          if (e.key === "Backspace") {
            e.preventDefault();
            if (digits[index]) {
              updateValue(index, "");
            } else {
              updateValue(Math.max(0, index - 1), "");
              focusPrev(index);
            }
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            focusPrev(index);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            focusNext(index);
          }
        }

        function handleInput(
          e: React.ChangeEvent<HTMLInputElement>,
          index: number
        ) {
          const val = e.target.value.replace(/\D/g, "").slice(-1);
          if (!val) return;
          updateValue(index, val);
          focusNext(index);
        }

        function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
          e.preventDefault();
          const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
          const arr = Array.from({ length }, (_, i) => pasted[i] ?? "");
          field.onChange(arr.join(""));
          // Focus last filled or last slot
          const lastIdx = Math.min(pasted.length, length - 1);
          inputsRef.current[lastIdx]?.focus();
        }

        return (
          <FieldWrapper
            label={label}
            description={description}
            error={fieldState.error?.message}
            required={required}
            htmlFor={`${id}-0`}
            className={wrapperClassName}
          >
            <div
              className="flex gap-2"
              role="group"
              aria-label={label ?? "PIN input"}
            >
              {digits.map((digit, i) => (
                <input
                  key={i}
                  id={i === 0 ? `${id}-0` : undefined}
                  ref={(el) => { inputsRef.current[i] = el; }}
                  type={mask ? "password" : "text"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Digit ${i + 1} of ${length}`}
                  aria-invalid={!!fieldState.error}
                  onChange={(e) => handleInput(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  onFocus={(e) => e.target.select()}
                  className={cn(
                    "formcraft-input",
                    "h-12 w-10 rounded-md border text-center text-lg font-semibold",
                    "bg-white dark:bg-gray-900",
                    "text-gray-900 dark:text-gray-100",
                    "transition-all duration-150",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    "dark:focus:ring-blue-400 dark:focus:border-blue-400",
                    digit
                      ? "border-blue-400 dark:border-blue-500"
                      : "border-gray-300 dark:border-gray-600",
                    fieldState.error &&
                      "border-red-400 dark:border-red-500 focus:ring-red-400"
                  )}
                />
              ))}
            </div>
          </FieldWrapper>
        );
      }}
    />
  );
}

PinInput.displayName = "FormCraft.PinInput";
