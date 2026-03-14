"use client";

import { cn } from "../../utils";

interface SkeletonProps {
  className?: string;
}

function Bone({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("formcraft-skeleton rounded", className)}
    />
  );
}

export interface FieldSkeletonProps {
  hasLabel?: boolean;
  hasDescription?: boolean;
  inputHeight?: "sm" | "md" | "lg" | "textarea";
}

/**
 * FieldSkeleton — loading placeholder for a single field.
 */
export function FieldSkeleton({
  hasLabel = true,
  hasDescription = false,
  inputHeight = "md",
}: FieldSkeletonProps) {
  const heightMap = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    textarea: "h-24",
  };

  return (
    <div className="space-y-1.5 w-full" aria-hidden="true">
      {hasLabel && <Bone className="h-4 w-24" />}
      {hasDescription && <Bone className="h-3 w-48 opacity-70" />}
      <Bone className={cn("w-full", heightMap[inputHeight])} />
    </div>
  );
}

export interface FormSkeletonProps {
  fields?: number;
  hasTitle?: boolean;
  hasSubmit?: boolean;
  className?: string;
}

/**
 * FormSkeleton — loading state for an entire form.
 * Use while form data is being fetched (e.g. edit forms).
 *
 * @example
 * if (isLoading) return <FormSkeleton fields={4} hasTitle hasSubmit />;
 */
export function FormSkeleton({
  fields = 3,
  hasTitle = false,
  hasSubmit = true,
  className,
}: FormSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading form..."
      className={cn("space-y-5 w-full", className)}
    >
      {hasTitle && (
        <div className="space-y-2">
          <Bone className="h-7 w-48" />
          <Bone className="h-4 w-72 opacity-70" />
        </div>
      )}

      {Array.from({ length: fields }).map((_, i) => (
        <FieldSkeleton
          key={i}
          hasLabel
          hasDescription={i === 0}
          inputHeight={i === fields - 1 ? "textarea" : "md"}
        />
      ))}

      {hasSubmit && (
        <div className="flex justify-end pt-1">
          <Bone className="h-10 w-28" />
        </div>
      )}
    </div>
  );
}

FormSkeleton.displayName = "FormCraft.FormSkeleton";
FieldSkeleton.displayName = "FormCraft.FieldSkeleton";
