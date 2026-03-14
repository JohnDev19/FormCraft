import {
  FieldValues,
  UseFormReturn,
  FieldPath,
  RegisterOptions,
  Control,
} from "react-hook-form";
import { ZodSchema } from "zod";
import { ReactNode, HTMLAttributes } from "react";

// ─── Form Context ──────────────────────────────────────────────────────────────

export interface FormContextValue<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export type ValidationSchema = ZodSchema | Record<string, RegisterOptions>;

export interface FormValidationConfig {
  schema?: ZodSchema;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  reValidateMode?: "onBlur" | "onChange" | "onSubmit";
}

// ─── Form Props ───────────────────────────────────────────────────────────────

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}

// ─── Field Wrapper ────────────────────────────────────────────────────────────

export interface FieldWrapperProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
}

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  rules?: RegisterOptions<TFieldValues>;
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

export interface TextareaProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  showCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
  rules?: RegisterOptions<TFieldValues>;
}

// ─── Select ───────────────────────────────────────────────────────────────────

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
  rules?: RegisterOptions<TFieldValues>;
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

export interface CheckboxProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  description?: string;
  rules?: RegisterOptions<TFieldValues>;
}

// ─── Radio Group ──────────────────────────────────────────────────────────────

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
  rules?: RegisterOptions<TFieldValues>;
}

// ─── Switch ───────────────────────────────────────────────────────────────────

export interface SwitchProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  description?: string;
  rules?: RegisterOptions<TFieldValues>;
}

// ─── File Upload ──────────────────────────────────────────────────────────────

export interface FileUploadProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  rules?: RegisterOptions<TFieldValues>;
}

// ─── Field Array ──────────────────────────────────────────────────────────────

export interface FieldArrayProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  addLabel?: string;
  removeLabel?: string;
  children: (index: number) => ReactNode;
  minItems?: number;
  maxItems?: number;
}

// ─── Form Submit Button ───────────────────────────────────────────────────────

export interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

// ─── Error Message ────────────────────────────────────────────────────────────

export interface ErrorMessageProps {
  message?: string;
  className?: string;
}

// ─── Form State ───────────────────────────────────────────────────────────────

export interface FormState {
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, { message?: string }>;
}

// ─── Utility Types ────────────────────────────────────────────────────────────

export type Size = "sm" | "md" | "lg";
export type Variant = "default" | "filled" | "flushed" | "unstyled";
export type ColorScheme = "blue" | "green" | "red" | "orange" | "purple" | "gray";
