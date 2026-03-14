"use client";

import React, { createContext, useContext } from "react";
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import { cn } from "../../utils";

// ─── Form Context ──────────────────────────────────────────────────────────────

const FormContext = createContext<UseFormReturn<FieldValues> | null>(null);

export function useFormContext<TFieldValues extends FieldValues = FieldValues>() {
  const ctx = useContext(FormContext) as UseFormReturn<TFieldValues> | null;
  if (!ctx) {
    throw new Error(
      "[FormCraft] useFormContext must be used inside a <Form> component."
    );
  }
  return ctx;
}

// ─── useFormCraft Hook ─────────────────────────────────────────────────────────

export interface UseFormCraftOptions<TFieldValues extends FieldValues> {
  schema?: ZodSchema;
  defaultValues?: DefaultValues<TFieldValues>;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onBlur" | "onChange" | "onSubmit";
}

/**
 * useFormCraft — wraps react-hook-form with Zod resolver support.
 *
 * @example
 * const form = useFormCraft({ schema: loginSchema, defaultValues: { email: '', password: '' } });
 */
export function useFormCraft<TFieldValues extends FieldValues = FieldValues>({
  schema,
  defaultValues,
  mode = "onBlur",
  reValidateMode = "onChange",
}: UseFormCraftOptions<TFieldValues> = {}): UseFormReturn<TFieldValues> {
  return useForm<TFieldValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode,
    reValidateMode,
  });
}

// ─── Form Component ────────────────────────────────────────────────────────────

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

/**
 * Form — Root form element. Provides form context to all children.
 *
 * @example
 * <Form form={form} onSubmit={handleSubmit}>
 *   <Input name="email" control={form.control} label="Email" />
 *   <SubmitButton>Sign in</SubmitButton>
 * </Form>
 */
export function Form<TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormContext.Provider value={form as UseFormReturn<FieldValues>}>
      <form
        onSubmit={form.handleSubmit(onSubmit as (data: FieldValues) => void)}
        noValidate
        className={cn("formcraft-form", className)}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

Form.displayName = "FormCraft.Form";
