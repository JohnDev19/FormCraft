"use client";

/**
 * examples/ContactForm.tsx
 *
 * Contact form with file attachment support.
 */

import React, { useState } from "react";
import { z } from "zod";
import {
  Form,
  Input,
  Textarea,
  Select,
  FileUpload,
  SubmitButton,
  FormActions,
  useFormCraft,
  emailSchema,
  requiredString,
} from "formcraft";

const contactSchema = z.object({
  name: requiredString("Name"),
  email: emailSchema,
  subject: z.string().min(1, "Please select a subject"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(20, "Please give us a bit more detail (min 20 chars)"),
  attachment: z.instanceof(File).optional().nullable(),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useFormCraft<ContactValues>({
    schema: contactSchema,
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      attachment: null,
    },
  });

  async function handleSubmit(data: ContactValues) {
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Contact form data:", data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-100 text-green-600 mb-2">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Message sent!</h2>
        <p className="text-gray-500 text-sm">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => { setSubmitted(false); form.reset(); }}
          className="text-sm text-blue-600 hover:underline mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Get in touch</h1>
        <p className="text-sm text-gray-500 mt-1">
          We typically respond within one business day.
        </p>
      </div>

      <Form form={form} onSubmit={handleSubmit} className="fc-spaced">
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="name"
            control={form.control}
            label="Your name"
            placeholder="Alice Johnson"
            required
          />
          <Input
            name="email"
            control={form.control}
            label="Email"
            type="email"
            placeholder="alice@example.com"
            required
          />
        </div>

        <Select
          name="subject"
          control={form.control}
          label="Subject"
          placeholder="What is this about?"
          required
          options={[
            { value: "general", label: "General inquiry" },
            { value: "billing", label: "Billing question" },
            { value: "bug", label: "Bug report" },
            { value: "feature", label: "Feature request" },
            { value: "other", label: "Something else" },
          ]}
        />

        <Textarea
          name="message"
          control={form.control}
          label="Message"
          placeholder="Tell us everything..."
          required
          showCount
          maxLength={1000}
          autoResize
          rows={5}
        />

        <FileUpload
          name="attachment"
          control={form.control}
          label="Attachment (optional)"
          description="Attach a screenshot or document if it helps explain your issue."
          accept=".png,.jpg,.jpeg,.pdf,.txt"
          maxSize={10 * 1024 * 1024} // 10 MB
        />

        <FormActions>
          <SubmitButton
            loading={form.formState.isSubmitting}
            loadingText="Sending..."
          >
            Send message
          </SubmitButton>
        </FormActions>
      </Form>
    </div>
  );
}
