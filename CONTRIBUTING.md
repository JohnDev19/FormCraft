# Contributing to FormCraft

Thank you for your interest in contributing! This document explains how to get set up, the project conventions, and how to submit changes.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 8 (`npm install -g pnpm`)
- **Git**

### Local Setup

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/JohnDev19/FormCraft.git
cd FormCraft

# 2. Install dependencies
pnpm install

# 3. Start the build watcher
pnpm dev

# 4. Run tests in watch mode (separate terminal)
pnpm test:watch
```

---

## Project Structure

```
formcraft/
├── src/
│   ├── components/         # One folder per component
│   │   ├── Form/
│   │   │   ├── index.tsx       ← <Form> + useFormCraft + context
│   │   │   ├── FieldWrapper.tsx
│   │   │   └── SubmitButton.tsx
│   │   ├── Input/
│   │   ├── Textarea/
│   │   ├── Select/
│   │   ├── Checkbox/
│   │   ├── Radio/
│   │   ├── Switch/
│   │   ├── FileUpload/
│   │   └── FieldArray/
│   ├── hooks/              # Custom React hooks
│   ├── validation/         # Zod schemas and helpers
│   ├── utils/              # cn(), formatBytes(), etc.
│   ├── types/              # Shared TypeScript interfaces
│   ├── styles.css          # Global CSS overrides
│   └── index.ts            # Public API barrel export
├── examples/               # Copy-paste ready forms
├── src/__tests__/          # Vitest + @testing-library tests
├── .github/workflows/      # CI and publish pipelines
├── tsup.config.ts
├── vitest.config.ts
└── package.json
```

---

## Development Workflow

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Build in watch mode |
| `pnpm build` | Production build |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Coverage report |
| `pnpm lint` | ESLint |
| `pnpm lint:fix` | ESLint with auto-fix |
| `pnpm type-check` | TypeScript check (no emit) |
| `pnpm format` | Prettier |

---

## Adding a New Component

Follow this checklist when adding a new field component:

1. **Create the folder** `src/components/MyComponent/`
2. **Create `index.tsx`** — follow the pattern in an existing component:
   - Accept `name`, `control`, `label`, `description` props
   - Use `<Controller>` from react-hook-form
   - Wrap with `<FieldWrapper>` for consistent label/error layout
   - Set `aria-invalid`, `aria-describedby` on the native element
   - Export with `ComponentName.displayName = "FormCraft.ComponentName"`
3. **Export from `src/index.ts`** — both the component and its props type
4. **Add tests** in `src/__tests__/MyComponent.test.tsx`
5. **Add an example** in `examples/` if useful
6. **Update README.md** with usage docs and props table

### Accessibility Requirements

Every interactive element MUST have:
- A programmatic label (`<label htmlFor>` or `aria-label` or `aria-labelledby`)
- `aria-invalid="true"` when in error state
- `aria-describedby` pointing to the error element (and description if present)
- Error element must have `role="alert"` and `aria-live="polite"`
- Keyboard accessibility (tab focus, Enter/Space where expected)
- Visible `:focus-visible` styles (never `outline: none` without replacement)

---

## Code Style

- **TypeScript strict mode** — no `any` without a comment explaining why
- **No default exports** in `src/` (named exports only, except examples)
- Component generic parameter: `<TFieldValues extends FieldValues>`
- Use `cn()` from `src/utils` for all className merging
- `"use client"` directive at the top of every component (Next.js App Router compat)
- No inline styles — Tailwind classes only
- Prefer `const` arrow functions for utilities; `function` declarations for React components and hooks

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add DatePicker component
fix: correct aria-describedby on Textarea
docs: add RadioGroup example to README
test: add FileUpload validation tests
chore: upgrade react-hook-form to 7.52
refactor: extract useFieldId hook
```

---

## Pull Requests

1. Fork → feature branch (`feat/date-picker`, `fix/checkbox-aria`)
2. All tests must pass: `pnpm test`
3. No TypeScript errors: `pnpm type-check`
4. No lint errors: `pnpm lint`
5. Add or update tests for your changes
6. Update README docs if you added a component or changed an API
7. Open the PR against the `main` branch with a clear description

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/JohnDev19/FormCraft/issues) with:

- FormCraft version
- React / Next.js version
- Minimal reproduction (CodeSandbox or StackBlitz preferred)
- Expected vs actual behavior

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
