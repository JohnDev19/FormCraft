"use client";

/**
 * examples/ProfileForm.tsx
 *
 * Edit profile form with auto-save, skeleton loading state, and alert feedback.
 */

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Textarea,
  Switch,
  SubmitButton,
  FormActions,
  FormAlert,
  FormSkeleton,
  useFormCraft,
  useFormAutoSave,
  profileSchema,
  type ProfileFormValues,
} from "formcraft";

async function fetchUser(): Promise<ProfileFormValues> {
  await new Promise((r) => setTimeout(r, 1200));
  return {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "555-123-4567",
    bio: "Full-stack developer. I love building accessible UIs.",
    website: "https://alicejohnson.dev",
  };
}

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useFormCraft<ProfileFormValues>({
    schema: profileSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bio: "",
      website: "",
    },
  });

  useEffect(() => {
    fetchUser().then((data) => {
      form.reset(data);
      setLoading(false);
    });
  }, [form]);

  const { isSaving, lastSaved } = useFormAutoSave(form, {
    onSave: async (data) => {
      // real app: await api.saveDraft(data)
      console.log("Auto-saved draft:", data);
    },
    debounce: 2000,
  });

  async function handleSubmit(data: ProfileFormValues) {
    setSuccess(false);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      console.log("Profile saved:", data);
      setSuccess(true);
    } catch {
      setError("Something went wrong saving your profile. Please try again.");
    }
  }

  if (loading) {
    return <FormSkeleton fields={5} hasTitle hasSubmit />;
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your personal information.
          </p>
        </div>
        {/* Auto-save indicator */}
        <div className="text-xs text-gray-400 shrink-0 pt-1 text-right">
          {isSaving ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Saving draft...
            </span>
          ) : lastSaved ? (
            <span>Draft saved {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <FormAlert
          variant="success"
          title="Profile updated"
          message="Your changes have been saved successfully."
          onDismiss={() => setSuccess(false)}
          className="mb-5"
        />
      )}
      {error && (
        <FormAlert
          variant="error"
          title="Save failed"
          message={error}
          onDismiss={() => setError(null)}
          className="mb-5"
        />
      )}

      <Form form={form} onSubmit={handleSubmit} className="fc-spaced">
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="firstName"
            control={form.control}
            label="First name"
            placeholder="Alice"
            required
            autoComplete="given-name"
          />
          <Input
            name="lastName"
            control={form.control}
            label="Last name"
            placeholder="Johnson"
            required
            autoComplete="family-name"
          />
        </div>

        <Input
          name="email"
          control={form.control}
          label="Email"
          type="email"
          placeholder="alice@example.com"
          required
          autoComplete="email"
          description="Used for login and notifications."
        />

        <Input
          name="phone"
          control={form.control}
          label="Phone"
          type="tel"
          placeholder="555-123-4567"
          autoComplete="tel"
        />

        <Textarea
          name="bio"
          control={form.control}
          label="Bio"
          placeholder="Tell people a little about yourself..."
          description="Appears on your public profile."
          showCount
          maxLength={500}
          autoResize
        />

        <Input
          name="website"
          control={form.control}
          label="Website"
          type="url"
          placeholder="https://yoursite.com"
          autoComplete="url"
        />

        <FormActions>
          <button
            type="button"
            onClick={() => form.reset()}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Discard changes
          </button>
          <SubmitButton
            loading={form.formState.isSubmitting}
            loadingText="Saving..."
            disabled={!form.formState.isDirty}
          >
            Save profile
          </SubmitButton>
        </FormActions>
      </Form>
    </div>
  );
}
