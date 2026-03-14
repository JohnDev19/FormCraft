// ─── Core Form ────────────────────────────────────────────────────────────────
export { Form, useFormCraft, useFormContext } from "./components/Form/index";
export type { FormProps, UseFormCraftOptions } from "./components/Form/index";

// ─── Field Wrapper ────────────────────────────────────────────────────────────
export { FieldWrapper } from "./components/Form/FieldWrapper";
export type { FieldWrapperProps } from "./components/Form/FieldWrapper";

// ─── Submit + Actions ─────────────────────────────────────────────────────────
export { SubmitButton, FormActions } from "./components/Form/SubmitButton";
export type { SubmitButtonProps } from "./components/Form/SubmitButton";

// ─── Input ────────────────────────────────────────────────────────────────────
export { Input } from "./components/Input/index";
export type { InputProps } from "./components/Input/index";

// ─── Textarea ─────────────────────────────────────────────────────────────────
export { Textarea } from "./components/Textarea/index";
export type { TextareaProps } from "./components/Textarea/index";

// ─── Select ───────────────────────────────────────────────────────────────────
export { Select } from "./components/Select/index";
export type { SelectProps, SelectOption } from "./components/Select/index";

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export { Checkbox } from "./components/Checkbox/index";
export type { CheckboxProps } from "./components/Checkbox/index";

// ─── Radio ────────────────────────────────────────────────────────────────────
export { RadioGroup } from "./components/Radio/index";
export type { RadioGroupProps, RadioOption } from "./components/Radio/index";

// ─── Switch ───────────────────────────────────────────────────────────────────
export { Switch } from "./components/Switch/index";
export type { SwitchProps } from "./components/Switch/index";

// ─── File Upload ──────────────────────────────────────────────────────────────
export { FileUpload } from "./components/FileUpload/index";
export type { FileUploadProps } from "./components/FileUpload/index";

// ─── Field Array ──────────────────────────────────────────────────────────────
export { FieldArray } from "./components/FieldArray/index";
export type { FieldArrayProps } from "./components/FieldArray/index";

// ─── Hooks ────────────────────────────────────────────────────────────────────
export {
  useFormPersist,
  usePasswordStrength,
  useMultiStepForm,
  useFormAutoSave,
} from "./hooks/index";
export type {
  UseFormPersistOptions,
  UseFormAutoSaveOptions,
  UseMultiStepFormOptions,
} from "./hooks/index";

// ─── Validation Schemas ───────────────────────────────────────────────────────
export {
  // Field schemas
  emailSchema,
  passwordSchema,
  simplePasswordSchema,
  phoneSchema,
  urlSchema,
  requiredString,
  optionalString,
  numberRange,
  positiveInt,
  futureDateSchema,
  mustBeChecked,
  // Pre-built form schemas
  loginSchema,
  registerSchema,
  contactSchema,
  profileSchema,
  // Helpers
  getPasswordStrength,
  flattenZodErrors,
} from "./validation/index";
export type {
  LoginFormValues,
  RegisterFormValues,
  ContactFormValues,
  ProfileFormValues,
} from "./validation/index";

// ─── Utilities ────────────────────────────────────────────────────────────────
export { cn, formatBytes, generateId, isEmpty } from "./utils/index";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  FormState,
  Size,
  Variant,
  ColorScheme,
  ValidationSchema,
  FormValidationConfig,
} from "./types/index";

// ─── DatePicker ───────────────────────────────────────────────────────────────
export { DatePicker } from "./components/DatePicker/index";
export type { DatePickerProps } from "./components/DatePicker/index";

// ─── PinInput ─────────────────────────────────────────────────────────────────
export { PinInput } from "./components/PinInput/index";
export type { PinInputProps } from "./components/PinInput/index";

// ─── FormSkeleton ─────────────────────────────────────────────────────────────
export { FormSkeleton, FieldSkeleton } from "./components/FormSkeleton/index";
export type { FormSkeletonProps, FieldSkeletonProps } from "./components/FormSkeleton/index";

// ─── FormAlert ────────────────────────────────────────────────────────────────
export { FormAlert } from "./components/FormAlert/index";
export type { FormAlertProps, AlertVariant } from "./components/FormAlert/index";

// ─── Re-export react-hook-form essentials ─────────────────────────────────────
// So consumers don't need a separate import for the most common RHF utilities
export {
  useForm,
  useWatch,
  useFormState,
  useController,
  Controller,
} from "react-hook-form";
export type {
  FieldValues,
  FieldPath,
  Control,
  UseFormReturn,
  SubmitHandler,
  SubmitErrorHandler,
  RegisterOptions,
} from "react-hook-form";
