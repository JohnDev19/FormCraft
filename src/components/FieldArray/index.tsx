"use client";

import React from "react";
import {
  useFieldArray,
  Control,
  FieldValues,
  FieldArrayPath,
  ArrayPath,
} from "react-hook-form";
import { cn } from "../../utils";

export interface FieldArrayProps<TFieldValues extends FieldValues = FieldValues> {
  name: ArrayPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  addLabel?: string;
  removeLabel?: string;
  children: (index: number) => React.ReactNode;
  minItems?: number;
  maxItems?: number;
  defaultItem?: Record<string, unknown>;
  wrapperClassName?: string;
}

/**
 * FieldArray — dynamic list of fields (e.g., multiple email addresses, work history).
 *
 * @example
 * <FieldArray
 *   name="emails"
 *   control={form.control}
 *   label="Email Addresses"
 *   addLabel="Add Email"
 *   defaultItem={{ email: '' }}
 * >
 *   {(index) => (
 *     <Input name={`emails.${index}.email`} control={form.control} label={`Email ${index + 1}`} />
 *   )}
 * </FieldArray>
 */
export function FieldArray<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  addLabel = "Add item",
  removeLabel = "Remove",
  children,
  minItems = 0,
  maxItems = Infinity,
  defaultItem = {},
  wrapperClassName,
}: FieldArrayProps<TFieldValues>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const canAdd = fields.length < maxItems;
  const canRemove = (index: number) => fields.length > minItems;

  return (
    <div className={cn("formcraft-field-array space-y-3", wrapperClassName)}>
      {/* Header */}
      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </p>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}

      {/* Fields */}
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          No items yet. Click "{addLabel}" to add one.
        </p>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="formcraft-field-array-item relative group flex items-start gap-2"
          >
            <div className="flex-1 min-w-0">{children(index)}</div>

            {canRemove(index) && (
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`${removeLabel} item ${index + 1}`}
                className={cn(
                  "mt-7 flex items-center justify-center h-8 w-8 shrink-0 rounded-md",
                  "border border-gray-200 dark:border-gray-700 text-gray-400",
                  "hover:border-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30",
                  "transition-all duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                )}
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add button */}
      {canAdd && (
        <button
          type="button"
          onClick={() => append(defaultItem as unknown as TFieldValues[ArrayPath<TFieldValues>][number])}
          className={cn(
            "formcraft-field-array-add",
            "flex items-center gap-1.5 text-sm font-medium",
            "text-blue-600 dark:text-blue-400",
            "hover:text-blue-700 dark:hover:text-blue-300",
            "transition-colors duration-150",
            "focus:outline-none focus:underline"
          )}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}

FieldArray.displayName = "FormCraft.FieldArray";
