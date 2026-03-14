# FormCraft

**Production-ready form components for React & Next.js.**

Schema validation, accessible UI, nice error messages, loading states — all wired up and ready to use.

```bash
npm install formcraft
# or
pnpm add formcraft
# or
yarn add formcraft
```

> **Peer dependencies:** `react >=18`, `zod >=3` (optional but recommended)

---

## Why FormCraft?

Forms in React apps are still painful:

- Setting up `react-hook-form` + Zod + error display every time
- Rolling your own accessible components with ARIA attributes
- Handling loading states, password toggles, character counts
- Building drag-and-drop file uploads from scratch
- Multi-step forms with per-step validation

FormCraft gives you all of that in one import.

---

## Quick Start

```tsx
// app/login/page.tsx (Next.js App Router)
"use client";

import { Form, Input, SubmitButton, useFormCraft, loginSchema } from "formcraft";
import type { LoginFormValues } from "formcraft";

export default function LoginPage() {
  const form = useFormCraft<LoginFormValues>({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    await signIn(data); // your auth call
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="fc-spaced">
      <Input name="email" control={form.control} label="Email" type="email" required />
      <Input name="password" control={form.control} label="Password" type="password" showPasswordToggle required />
      <SubmitButton loading={form.formState.isSubmitting} loadingText="Signing in...">
        Sign in
      </SubmitButton>
    </Form>
  );
}
```

Add the stylesheet once in your `app/layout.tsx` (or `_app.tsx`):

```tsx
import "formcraft/styles";
```

Tailwind CSS must be installed in your project. FormCraft uses Tailwind utility classes and dark mode via `dark:` variants.

---

## Components

### `<Form>`

Root form element. Provides form context; wraps `react-hook-form`'s `handleSubmit`.

```tsx
<Form form={form} onSubmit={handleSubmit} className="fc-spaced">
  {/* fields */}
</Form>
```

Add the `fc-spaced` class to get automatic vertical spacing between fields.

| Prop | Type | Description |
|------|------|-------------|
| `form` | `UseFormReturn` | Form instance from `useFormCraft` |
| `onSubmit` | `(data) => void \| Promise<void>` | Called with validated data |
| `className` | `string` | Additional CSS classes |

---

### `<Input>`

Covers: text, email, password, number, search, tel, url.

```tsx
<Input
  name="email"
  control={form.control}
  label="Email"
  type="email"
  placeholder="you@example.com"
  required
  leftIcon={<MailIcon />}
/>

<Input
  name="password"
  control={form.control}
  label="Password"
  type="password"
  showPasswordToggle
/>
```

| Prop | Type | Default |
|------|------|---------|
| `name` | `FieldPath<T>` | — |
| `control` | `Control<T>` | — |
| `label` | `string` | — |
| `description` | `string` | — |
| `leftIcon` | `ReactNode` | — |
| `rightIcon` | `ReactNode` | — |
| `loading` | `boolean` | `false` |
| `showPasswordToggle` | `boolean` | `false` |

---

### `<Textarea>`

```tsx
<Textarea
  name="bio"
  control={form.control}
  label="Bio"
  showCount
  maxLength={300}
  autoResize
/>
```

| Prop | Type | Default |
|------|------|---------|
| `showCount` | `boolean` | `false` |
| `maxLength` | `number` | — |
| `autoResize` | `boolean` | `false` |

---

### `<Select>`

```tsx
<Select
  name="country"
  control={form.control}
  label="Country"
  placeholder="Select a country"
  options={[
    { value: "us", label: "United States" },
    { value: "ph", label: "Philippines" },
  ]}
/>
```

---

### `<Checkbox>`

```tsx
<Checkbox
  name="acceptTerms"
  control={form.control}
  label="I agree to the Terms of Service"
/>
```

---

### `<RadioGroup>`

```tsx
<RadioGroup
  name="plan"
  control={form.control}
  label="Plan"
  options={[
    { value: "free", label: "Free", description: "Up to 3 projects" },
    { value: "pro", label: "Pro", description: "Unlimited projects" },
  ]}
/>
```

---

### `<Switch>`

```tsx
<Switch
  name="notifications"
  control={form.control}
  label="Email notifications"
  description="Receive weekly digest emails"
/>
```

---

### `<FileUpload>`

Drag-and-drop with type/size validation.

```tsx
<FileUpload
  name="avatar"
  control={form.control}
  label="Profile photo"
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
/>
```

| Prop | Type | Default |
|------|------|---------|
| `accept` | `string` | — |
| `multiple` | `boolean` | `false` |
| `maxSize` | `number` (bytes) | — |
| `maxFiles` | `number` | `10` |

---

### `<FieldArray>`

Dynamic repeating fields.

```tsx
<FieldArray
  name="members"
  control={form.control}
  label="Team members"
  addLabel="Add member"
  minItems={1}
  maxItems={10}
  defaultItem={{ name: "", email: "" }}
>
  {(index) => (
    <>
      <Input name={`members.${index}.name`} control={form.control} label="Name" />
      <Input name={`members.${index}.email`} control={form.control} label="Email" />
    </>
  )}
</FieldArray>
```

---

### `<SubmitButton>` & `<FormActions>`

```tsx
<FormActions align="right">
  <button type="button" onClick={onCancel}>Cancel</button>
  <SubmitButton
    loading={form.formState.isSubmitting}
    loadingText="Saving..."
    variant="primary"    // "primary" | "secondary" | "destructive" | "ghost"
    size="md"            // "sm" | "md" | "lg"
  >
    Save changes
  </SubmitButton>
</FormActions>
```

---

## Hooks

### `useFormCraft`

Wraps `react-hook-form` with Zod resolver.

```ts
const form = useFormCraft({
  schema: myZodSchema,
  defaultValues: { email: "" },
  mode: "onBlur",          // default
  reValidateMode: "onChange",
});
```

---

### `useMultiStepForm`

```ts
const { step, totalSteps, next, back, goTo, isFirst, isLast, progress } =
  useMultiStepForm({ steps: 3 });
```

Per-step validation:
```ts
async function handleNext() {
  const valid = await form.trigger(["firstName", "lastName"]);
  if (valid) next();
}
```

---

### `usePasswordStrength`

```tsx
const strength = usePasswordStrength(form.watch("password"));
// { score: 3, label: "Good", color: "text-blue-500", percentage: 60 }

<div style={{ width: `${strength.percentage}%` }} className={strengthBarColor} />
<span className={strength.color}>{strength.label}</span>
```

---

### `useFormPersist`

```ts
useFormPersist(form, {
  key: "signup-form",
  storage: "sessionStorage",
  excludeFields: ["password"],
});
```

---

### `useFormAutoSave`

```ts
const { isSaving, lastSaved } = useFormAutoSave(form, {
  onSave: async (data) => await api.saveDraft(data),
  debounce: 1500,
});
```

---

## Validation Schemas

Import pre-built Zod schemas or build your own with the helpers.

```ts
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  urlSchema,
  requiredString,
  mustBeChecked,
  loginSchema,
  registerSchema,
  contactSchema,
} from "formcraft";
```

### Build your own

```ts
import { z } from "zod";
import { emailSchema, requiredString, mustBeChecked } from "formcraft";

const checkoutSchema = z.object({
  email: emailSchema,
  address: requiredString("Address"),
  city: requiredString("City"),
  acceptTerms: mustBeChecked("Please accept terms"),
});
```

---

## Accessibility

Every FormCraft component is built with accessibility first:

- All inputs have associated `<label>` via `htmlFor`/`id` (auto-generated)
- Error messages use `role="alert"` + `aria-live="polite"`
- Inputs set `aria-invalid` when there's an error
- `aria-describedby` links inputs to their descriptions and errors
- `RadioGroup` uses `role="radiogroup"`
- `Switch` uses `role="switch"` + `aria-checked`
- `FileUpload` zone is keyboard-navigable (`Enter` / `Space` to open)
- All interactive elements have `:focus-visible` styles
- Shake animation is `prefers-reduced-motion` safe (CSS only)

---

## TypeScript

All components accept a generic `TFieldValues` parameter. Because `name` is typed as `FieldPath<TFieldValues>`, you get full autocomplete:

```tsx
// ✅ TypeScript error if "emaill" doesn't exist in your schema
<Input name="emaill" control={form.control} />
```

---

## Dark Mode

FormCraft supports Tailwind's `dark:` class strategy. Ensure your Tailwind config has:

```js
// tailwind.config.js
module.exports = {
  darkMode: "class", // or "media"
  content: ["./node_modules/formcraft/dist/**/*.{js,mjs}"],
};
```

---

## Roadmap

- [ ] `DatePicker` component
- [ ] `ComboBox` / searchable select
- [ ] `PinInput` (OTP)
- [ ] `FormSkeleton` loading placeholder
- [ ] React Native support

---

## Contributing

PRs and issues are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

```bash
git clone https://github.com/formcraft/formcraft
pnpm install
pnpm dev       # watch mode
pnpm test      # run tests
```

---

## License

MIT © FormCraft Contributors
