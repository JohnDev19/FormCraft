import { describe, it, expect } from "vitest";
import { cn, formatBytes, generateId, isEmpty, isFileTypeAccepted } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("deduplicates conflicting Tailwind classes", () => {
    // tailwind-merge resolves conflicts
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});

describe("formatBytes", () => {
  it("formats 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1 KB");
  });

  it("formats megabytes", () => {
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
  });

  it("respects decimal places", () => {
    expect(formatBytes(1536, 1)).toBe("1.5 KB");
  });
});

describe("generateId", () => {
  it("generates a string", () => {
    expect(typeof generateId()).toBe("string");
  });

  it("uses default prefix", () => {
    expect(generateId().startsWith("field-")).toBe(true);
  });

  it("uses custom prefix", () => {
    expect(generateId("input").startsWith("input-")).toBe(true);
  });

  it("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("isEmpty", () => {
  it("returns true for null", () => expect(isEmpty(null)).toBe(true));
  it("returns true for undefined", () => expect(isEmpty(undefined)).toBe(true));
  it("returns true for empty string", () => expect(isEmpty("")).toBe(true));
  it("returns true for whitespace-only string", () => expect(isEmpty("   ")).toBe(true));
  it("returns true for empty array", () => expect(isEmpty([])).toBe(true));
  it("returns false for non-empty string", () => expect(isEmpty("hello")).toBe(false));
  it("returns false for non-empty array", () => expect(isEmpty([1])).toBe(false));
  it("returns false for 0", () => expect(isEmpty(0)).toBe(false));
  it("returns false for false", () => expect(isEmpty(false)).toBe(false));
});

describe("isFileTypeAccepted", () => {
  function makeFile(name: string, type: string): File {
    return new File([""], name, { type });
  }

  it("accepts any file when accept is '*'", () => {
    expect(isFileTypeAccepted(makeFile("photo.jpg", "image/jpeg"), "*")).toBe(true);
  });

  it("accepts by extension", () => {
    expect(isFileTypeAccepted(makeFile("doc.pdf", "application/pdf"), ".pdf")).toBe(true);
  });

  it("rejects wrong extension", () => {
    expect(isFileTypeAccepted(makeFile("doc.docx", "application/msword"), ".pdf")).toBe(false);
  });

  it("accepts by MIME wildcard (image/*)", () => {
    expect(isFileTypeAccepted(makeFile("photo.jpg", "image/jpeg"), "image/*")).toBe(true);
  });

  it("rejects non-image for image/*", () => {
    expect(isFileTypeAccepted(makeFile("doc.pdf", "application/pdf"), "image/*")).toBe(false);
  });

  it("handles comma-separated accept values", () => {
    expect(
      isFileTypeAccepted(makeFile("photo.png", "image/png"), "image/jpeg, .png, .gif")
    ).toBe(true);
  });
});
