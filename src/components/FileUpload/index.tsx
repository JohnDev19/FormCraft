"use client";

import React, { useId, useRef, useState, useCallback } from "react";
import { Controller, FieldValues, FieldPath, Control } from "react-hook-form";
import { FieldWrapper } from "../Form/FieldWrapper";
import { cn, formatBytes, isFileTypeAccepted } from "../../utils";

export interface FileUploadProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  wrapperClassName?: string;
  required?: boolean;
}

/**
 * FileUpload — drag & drop file upload with validation.
 *
 * @example
 * <FileUpload
 *   name="avatar"
 *   control={form.control}
 *   label="Profile Photo"
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 * />
 */
export function FileUpload<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  description,
  accept,
  multiple = false,
  maxSize,
  maxFiles = 10,
  wrapperClassName,
  required,
}: FileUploadProps<TFieldValues>) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const files: File[] = Array.isArray(field.value)
          ? field.value
          : field.value
          ? [field.value]
          : [];

        function validateAndSetFiles(incoming: File[]) {
          setFileError(null);
          if (maxFiles && incoming.length > maxFiles) {
            setFileError(`You can upload at most ${maxFiles} files.`);
            return;
          }
          for (const file of incoming) {
            if (maxSize && file.size > maxSize) {
              setFileError(
                `"${file.name}" is too large. Max size is ${formatBytes(maxSize)}.`
              );
              return;
            }
            if (accept && !isFileTypeAccepted(file, accept)) {
              setFileError(`"${file.name}" is not an accepted file type.`);
              return;
            }
          }
          field.onChange(multiple ? incoming : incoming[0] ?? null);
        }

        function handleFiles(rawFiles: FileList | null) {
          if (!rawFiles) return;
          validateAndSetFiles(Array.from(rawFiles));
        }

        const handleDrop = useCallback(
          (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [multiple, maxSize, accept, maxFiles]
        );

        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragging(true);
        };

        const handleDragLeave = () => setIsDragging(false);

        function removeFile(index: number) {
          if (multiple) {
            const updated = files.filter((_, i) => i !== index);
            field.onChange(updated.length ? updated : null);
          } else {
            field.onChange(null);
            if (inputRef.current) inputRef.current.value = "";
          }
        }

        const displayError = fieldState.error?.message ?? fileError ?? undefined;

        return (
          <FieldWrapper
            label={label}
            description={description}
            error={displayError}
            required={required}
            htmlFor={id}
            className={wrapperClassName}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload files"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "formcraft-fileupload",
                "flex flex-col items-center justify-center gap-3",
                "rounded-lg border-2 border-dashed px-6 py-8",
                "cursor-pointer transition-all duration-150 text-center",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                isDragging
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                displayError && "border-red-400 dark:border-red-500"
              )}
            >
              <input
                ref={inputRef}
                id={id}
                type="file"
                accept={accept}
                multiple={multiple}
                className="sr-only"
                aria-hidden="true"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* Upload icon */}
              <div
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-full",
                  isDragging
                    ? "bg-blue-100 dark:bg-blue-900/50"
                    : "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <svg
                  className={cn(
                    "h-5 w-5",
                    isDragging
                      ? "text-blue-500"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 dark:text-blue-400">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {accept && `${accept.replace(/,/g, ", ")} • `}
                  {maxSize && `Up to ${formatBytes(maxSize)}`}
                  {multiple && maxFiles && ` • Max ${maxFiles} files`}
                </p>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <ul className="mt-2 space-y-1" aria-label="Selected files">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <svg
                        className="h-4 w-4 text-gray-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      aria-label={`Remove ${file.name}`}
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </FieldWrapper>
        );
      }}
    />
  );
}

FileUpload.displayName = "FormCraft.FileUpload";
