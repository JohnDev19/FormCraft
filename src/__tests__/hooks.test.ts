import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMultiStepForm, usePasswordStrength } from "../hooks";

// ─── useMultiStepForm ─────────────────────────────────────────────────────────

describe("useMultiStepForm", () => {
  it("starts at step 0 by default", () => {
    const { result } = renderHook(() => useMultiStepForm({ steps: 3 }));
    expect(result.current.step).toBe(0);
  });

  it("respects initialStep", () => {
    const { result } = renderHook(() =>
      useMultiStepForm({ steps: 3, initialStep: 1 })
    );
    expect(result.current.step).toBe(1);
  });

  it("advances with next()", () => {
    const { result } = renderHook(() => useMultiStepForm({ steps: 3 }));
    act(() => result.current.next());
    expect(result.current.step).toBe(1);
  });

  it("does not advance past last step", () => {
    const { result } = renderHook(() =>
      useMultiStepForm({ steps: 2, initialStep: 1 })
    );
    act(() => result.current.next());
    expect(result.current.step).toBe(1);
  });

  it("goes back with back()", () => {
    const { result } = renderHook(() =>
      useMultiStepForm({ steps: 3, initialStep: 2 })
    );
    act(() => result.current.back());
    expect(result.current.step).toBe(1);
  });

  it("does not go back past step 0", () => {
    const { result } = renderHook(() => useMultiStepForm({ steps: 3 }));
    act(() => result.current.back());
    expect(result.current.step).toBe(0);
  });

  it("goTo navigates to specific step", () => {
    const { result } = renderHook(() => useMultiStepForm({ steps: 5 }));
    act(() => result.current.goTo(3));
    expect(result.current.step).toBe(3);
  });

  it("goTo ignores out-of-bounds values", () => {
    const { result } = renderHook(() => useMultiStepForm({ steps: 3 }));
    act(() => result.current.goTo(10));
    expect(result.current.step).toBe(0);
  });

  it("isFirst is true on step 0", () => {
    const { result } = renderHook(() => useMultiStepForm({ steps: 3 }));
    expect(result.current.isFirst).toBe(true);
  });

  it("isLast is true on last step", () => {
    const { result } = renderHook(() =>
      useMultiStepForm({ steps: 3, initialStep: 2 })
    );
    expect(result.current.isLast).toBe(true);
  });

  it("progress is calculated correctly", () => {
    const { result } = renderHook(() =>
      useMultiStepForm({ steps: 4, initialStep: 1 })
    );
    // step 1 of 4 = (1+1)/4 * 100 = 50%
    expect(result.current.progress).toBe(50);
  });
});

// ─── usePasswordStrength ──────────────────────────────────────────────────────

describe("usePasswordStrength", () => {
  it("returns score 0 for empty string", () => {
    const { result } = renderHook(() => usePasswordStrength(""));
    expect(result.current.score).toBe(0);
    expect(result.current.isEmpty).toBe(true);
  });

  it("returns score 0 for undefined", () => {
    const { result } = renderHook(() => usePasswordStrength(undefined));
    expect(result.current.score).toBe(0);
  });

  it("increases score with complexity", () => {
    const { result: weak } = renderHook(() => usePasswordStrength("abc"));
    const { result: strong } = renderHook(() =>
      usePasswordStrength("MyP@ssw0rd!")
    );
    expect(strong.current.score).toBeGreaterThan(weak.current.score);
  });

  it("calculates percentage from score", () => {
    const { result } = renderHook(() => usePasswordStrength("MyP@ssw0rd!"));
    expect(result.current.percentage).toBe((result.current.score / 5) * 100);
  });

  it("isEmpty is false for non-empty string", () => {
    const { result } = renderHook(() => usePasswordStrength("hello"));
    expect(result.current.isEmpty).toBe(false);
  });
});
