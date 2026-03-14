"use client";

/**
 * examples/DynamicFieldsForm.tsx
 *
 * A dynamic team members form using FieldArray.
 */

import React from "react";
import { z } from "zod";
import {
  Form,
  Input,
  Select,
  FieldArray,
  SubmitButton,
  FormActions,
  useFormCraft,
  emailSchema,
  requiredString,
} from "formcraft";

const teamSchema = z.object({
  teamName: requiredString("Team name"),
  members: z
    .array(
      z.object({
        name: requiredString("Name"),
        email: emailSchema,
        role: z.string().min(1, "Select a role"),
      })
    )
    .min(1, "Add at least one team member"),
});

type TeamValues = z.infer<typeof teamSchema>;

export default function DynamicFieldsForm() {
  const form = useFormCraft<TeamValues>({
    schema: teamSchema,
    defaultValues: {
      teamName: "",
      members: [{ name: "", email: "", role: "" }],
    },
  });

  async function handleSubmit(data: TeamValues) {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Team data:", JSON.stringify(data, null, 2));
    alert(`Created team "${data.teamName}" with ${data.members.length} member(s)!`);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create a team</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add your team members below. You can always add more later.
        </p>
      </div>

      <Form form={form} onSubmit={handleSubmit} className="fc-spaced">
        <Input
          name="teamName"
          control={form.control}
          label="Team name"
          placeholder="Design Team"
          required
        />

        <FieldArray
          name="members"
          control={form.control}
          label="Team members"
          addLabel="Add member"
          minItems={1}
          maxItems={20}
          defaultItem={{ name: "", email: "", role: "" }}
        >
          {(index) => (
            <div className="grid grid-cols-3 gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
              <Input
                name={`members.${index}.name` as `members.${number}.name`}
                control={form.control}
                label={index === 0 ? "Full name" : undefined}
                placeholder="Alice Johnson"
              />
              <Input
                name={`members.${index}.email` as `members.${number}.email`}
                control={form.control}
                label={index === 0 ? "Email" : undefined}
                type="email"
                placeholder="alice@company.com"
              />
              <Select
                name={`members.${index}.role` as `members.${number}.role`}
                control={form.control}
                label={index === 0 ? "Role" : undefined}
                placeholder="Select role"
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "editor", label: "Editor" },
                  { value: "viewer", label: "Viewer" },
                ]}
              />
            </div>
          )}
        </FieldArray>

        <FormActions>
          <button
            type="button"
            onClick={() => form.reset()}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <SubmitButton
            loading={form.formState.isSubmitting}
            loadingText="Creating team..."
          >
            Create team
          </SubmitButton>
        </FormActions>
      </Form>
    </div>
  );
}
