"use client";

import { useEffect, useCallback, useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { getPasswordStrength } from "../validation";

// ─── useFormPersist ────────────────────────────────────────────────────────────

export interface UseFormPersistOptions {
  key: string;
  storage?: "localStorage" | "sessionStorage";
  excludeFields?: string[];
}

/**
 * useFormPersist — automatically saves and restores form state to browser storage.
 *
 * @example
 * const form = useFormCraft({ schema, defaultValues });
 * useFormPersist(form, { key: 'registration-form' });
 */
export function useFormPersist<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  { key, storage = "localStorage", excludeFields = [] }: UseFormPersistOptions
) {
  const { watch, setValue, formState } = form;

  // Restore on mount
  useEffect(() => {
    try {
      const store = window[storage];
      const saved = store.getItem(key);
      if (!saved) return;
      const values = JSON.parse(saved) as Partial<TFieldValues>;
      Object.entries(values).forEach(([field, value]) => {
        if (!excludeFields.includes(field)) {
          setValue(field as keyof TFieldValues & string, value as TFieldValues[keyof TFieldValues]);
        }
      });
    } catch {
      // Silently fail if storage is unavailable
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        const store = window[storage];
        const filtered = Object.fromEntries(
          Object.entries(values).filter(([k]) => !excludeFields.includes(k))
        );
        store.setItem(key, JSON.stringify(filtered));
      } catch {
        // Silently fail
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, key, storage, excludeFields]);

  const clear = useCallback(() => {
    try {
      window[storage].removeItem(key);
    } catch {
      // Silently fail
    }
  }, [key, storage]);

  return { clear };
}

// ─── usePasswordStrength ───────────────────────────────────────────────────────

/**
 * usePasswordStrength — reactive password strength indicator.
 *
 * @example
 * const strength = usePasswordStrength(form.watch('password'));
 * // { score: 3, label: 'Good', color: 'text-blue-500', percentage: 75 }
 */
export function usePasswordStrength(password: string = "") {
  const result = getPasswordStrength(password);
  return {
    ...result,
    percentage: (result.score / 5) * 100,
    isEmpty: !password,
  };
}

// ─── useMultiStepForm ──────────────────────────────────────────────────────────

export interface UseMultiStepFormOptions {
  steps: number;
  initialStep?: number;
}

/**
 * useMultiStepForm — manage multi-step form navigation.
 *
 * @example
 * const { step, totalSteps, next, back, goTo, isFirst, isLast, progress } =
 *   useMultiStepForm({ steps: 3 });
 */
export function useMultiStepForm({ steps, initialStep = 0 }: UseMultiStepFormOptions) {
  const [step, setStep] = useState(initialStep);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, steps - 1));
  }, [steps]);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps) setStep(index);
    },
    [steps]
  );

  return {
    step,
    totalSteps: steps,
    next,
    back,
    goTo,
    isFirst: step === 0,
    isLast: step === steps - 1,
    progress: Math.round(((step + 1) / steps) * 100),
  };
}

// ─── useFormAutoSave ───────────────────────────────────────────────────────────

export interface UseFormAutoSaveOptions<TFieldValues extends FieldValues> {
  onSave: (data: Partial<TFieldValues>) => Promise<void> | void;
  debounce?: number; // ms
}

/**
 * useFormAutoSave — auto-save form data after user stops typing.
 *
 * @example
 * const { isSaving, lastSaved } = useFormAutoSave(form, {
 *   onSave: async (data) => await api.saveDraft(data),
 *   debounce: 1500,
 * });
 */
export function useFormAutoSave<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  { onSave, debounce = 1000 }: UseFormAutoSaveOptions<TFieldValues>
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const subscription = form.watch((values) => {
      const timer = setTimeout(async () => {
        setIsSaving(true);
        try {
          await onSave(values as Partial<TFieldValues>);
          setLastSaved(new Date());
        } finally {
          setIsSaving(false);
        }
      }, debounce);
      return () => clearTimeout(timer);
    });
    return () => subscription.unsubscribe();
  }, [form, onSave, debounce]);

  return { isSaving, lastSaved };
}
