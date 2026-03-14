import { z } from "zod";

// ─── Common Field Schemas ──────────────────────────────────────────────────────

/**
 * Email field with friendly error messages.
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

/**
 * Password field with strength requirements.
 */
export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/**
 * Simple password (no strength requirements).
 */
export const simplePasswordSchema = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters");

/**
 * Phone number — accepts common formats including international (+1 555-123-4567,
 * +44 20 7946 0958) and local (555-123-4567, (555) 123-4567, 5551234567).
 */
export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(
    /^[+]?[\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,6}$/,
    "Please enter a valid phone number"
  );

/**
 * URL field.
 */
export const urlSchema = z
  .string()
  .min(1, "URL is required")
  .url("Please enter a valid URL");

/**
 * Required string with custom label.
 */
export const requiredString = (fieldName = "This field") =>
  z.string().min(1, `${fieldName} is required`);

/**
 * Optional string (empty is okay).
 */
export const optionalString = z.string().optional().or(z.literal(""));

/**
 * Number within a range.
 */
export const numberRange = (min: number, max: number, fieldName = "Value") =>
  z
    .number({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a number`,
    })
    .min(min, `${fieldName} must be at least ${min}`)
    .max(max, `${fieldName} must be at most ${max}`);

/**
 * Positive integer.
 */
export const positiveInt = (fieldName = "Value") =>
  z
    .number({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a number`,
    })
    .int(`${fieldName} must be a whole number`)
    .positive(`${fieldName} must be positive`);

/**
 * Date that is not in the past.
 */
export const futureDateSchema = z
  .date()
  .min(new Date(), "Date must be in the future");

/**
 * Checkbox that must be checked (e.g. agree to terms).
 */
export const mustBeChecked = (message = "You must accept to continue") =>
  z.boolean().refine((val) => val === true, { message });

// ─── Common Form Schemas ───────────────────────────────────────────────────────

/**
 * Login form schema.
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: simplePasswordSchema,
  rememberMe: z.boolean().optional(),
});

/**
 * Registration form schema.
 */
export const registerSchema = z
  .object({
    name: requiredString("Name"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: mustBeChecked("You must accept the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Contact form schema.
 */
export const contactSchema = z.object({
  name: requiredString("Name"),
  email: emailSchema,
  subject: requiredString("Subject"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

/**
 * Profile form schema.
 */
export const profileSchema = z.object({
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  website: urlSchema.optional().or(z.literal("")),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;

// ─── Validation Helpers ───────────────────────────────────────────────────────

/**
 * Measure password strength (0-4).
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Very Weak", color: "text-red-500" },
    { label: "Weak", color: "text-orange-500" },
    { label: "Fair", color: "text-yellow-500" },
    { label: "Good", color: "text-blue-500" },
    { label: "Strong", color: "text-green-500" },
  ];

  return { score, ...levels[Math.min(score, 4)] };
}

/**
 * Flatten Zod error messages into a flat object.
 */
export function flattenZodErrors(
  error: z.ZodError
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (path && !result[path]) {
      result[path] = issue.message;
    }
  }
  return result;
}
