# Changelog

All notable changes to FormCraft will be documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [1.0.0] — 2024-03-01

### Added
- `Form` — root component with context provider and `react-hook-form` integration
- `useFormCraft` — hook wrapping `useForm` with Zod resolver support
- `Input` — text, email, password, number, search fields with icon slots and password toggle
- `Textarea` — auto-resize and character count support
- `Select` — accessible native select with custom chevron
- `Checkbox` — accessible checkbox with inline error
- `RadioGroup` — radio button group, horizontal or vertical
- `Switch` — accessible toggle switch
- `FileUpload` — drag-and-drop file upload with type/size validation
- `FieldArray` — dynamic list of fields with add/remove
- `SubmitButton` — submit button with loading state and variants
- `FormActions` — layout wrapper for form buttons
- `FieldWrapper` — shared label/description/error layout (accessible)
- `useFormPersist` — auto-save form to localStorage/sessionStorage
- `usePasswordStrength` — reactive password strength meter
- `useMultiStepForm` — multi-step form navigation
- `useFormAutoSave` — debounced auto-save callback hook
- Pre-built Zod schemas: `emailSchema`, `passwordSchema`, `loginSchema`, `registerSchema`, `contactSchema`, `profileSchema`
- Helper: `getPasswordStrength`, `flattenZodErrors`
- Full accessibility: ARIA labels, live regions, `role=alert` on errors, keyboard navigation
- Dark mode support via Tailwind CSS dark: classes
- Shake animation on field error
- TypeScript generics on all components for type-safe `name` props
- Comprehensive test suite (vitest + @testing-library/react)
- CI/CD with GitHub Actions (lint, test, build, publish)
- 4 ready-to-use examples: Login, Register, Multi-step, Contact, Dynamic Fields
