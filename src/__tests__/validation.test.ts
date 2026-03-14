import { describe, it, expect } from "vitest";
import {
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  contactSchema,
  getPasswordStrength,
  flattenZodErrors,
  mustBeChecked,
  phoneSchema,
  urlSchema,
} from "../validation";

describe("emailSchema", () => {
  it("accepts valid emails", () => {
    expect(emailSchema.safeParse("user@example.com").success).toBe(true);
    expect(emailSchema.safeParse("user+tag@sub.domain.org").success).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(emailSchema.safeParse("").success).toBe(false);
    expect(emailSchema.safeParse("notanemail").success).toBe(false);
    expect(emailSchema.safeParse("missing@").success).toBe(false);
  });

  it("returns correct error message for empty", () => {
    const result = emailSchema.safeParse("");
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Email is required");
    }
  });
});

describe("passwordSchema", () => {
  it("accepts strong passwords", () => {
    expect(passwordSchema.safeParse("MyP@ssw0rd").success).toBe(true);
    expect(passwordSchema.safeParse("SecurePass1").success).toBe(true);
  });

  it("rejects weak passwords", () => {
    expect(passwordSchema.safeParse("short").success).toBe(false);
    expect(passwordSchema.safeParse("alllowercase1").success).toBe(false);
    expect(passwordSchema.safeParse("ALLUPPERCASE1").success).toBe(false);
    expect(passwordSchema.safeParse("NoNumbers!").success).toBe(false);
  });
});

describe("phoneSchema", () => {
  it("accepts valid phone numbers", () => {
    expect(phoneSchema.safeParse("555-123-4567").success).toBe(true);
    expect(phoneSchema.safeParse("+1 (555) 123-4567").success).toBe(true);
  });
});

describe("urlSchema", () => {
  it("accepts valid URLs", () => {
    expect(urlSchema.safeParse("https://example.com").success).toBe(true);
    expect(urlSchema.safeParse("http://localhost:3000").success).toBe(true);
  });

  it("rejects invalid URLs", () => {
    expect(urlSchema.safeParse("not-a-url").success).toBe(false);
    expect(urlSchema.safeParse("ftp://").success).toBe(false);
  });
});

describe("mustBeChecked", () => {
  it("rejects false", () => {
    expect(mustBeChecked().safeParse(false).success).toBe(false);
  });

  it("accepts true", () => {
    expect(mustBeChecked().safeParse(true).success).toBe(true);
  });

  it("uses custom message", () => {
    const result = mustBeChecked("Accept terms").safeParse(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Accept terms");
    }
  });
});

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "secret1" }).success
    ).toBe(true);
  });

  it("rejects missing fields", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "Alice",
    email: "alice@example.com",
    password: "MyP@ssword1",
    confirmPassword: "MyP@ssword1",
    acceptTerms: true,
  };

  it("accepts valid registration data", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path.includes("confirmPassword"));
      expect(err?.message).toBe("Passwords do not match");
    }
  });

  it("rejects unchecked terms", () => {
    const result = registerSchema.safeParse({ ...valid, acceptTerms: false });
    expect(result.success).toBe(false);
  });
});

describe("getPasswordStrength", () => {
  it("scores empty string as 0", () => {
    expect(getPasswordStrength("").score).toBe(0);
  });

  it("scores a strong password highly", () => {
    expect(getPasswordStrength("MyP@ssw0rd!").score).toBeGreaterThanOrEqual(4);
  });

  it("returns correct labels", () => {
    expect(getPasswordStrength("").label).toBe("Very Weak");
    expect(getPasswordStrength("MyP@ssw0rd!").label).toBe("Strong");
  });

  it("returns color classes", () => {
    const strong = getPasswordStrength("MyP@ssw0rd!");
    expect(strong.color).toContain("text-");
  });
});

describe("flattenZodErrors", () => {
  it("flattens nested errors into dot-notation keys", () => {
    const schema = loginSchema;
    const result = schema.safeParse({ email: "bad", password: "" });
    if (!result.success) {
      const flat = flattenZodErrors(result.error);
      expect(flat).toHaveProperty("email");
      expect(flat).toHaveProperty("password");
    }
  });
});
