import { beforeEach, describe, expect, it } from "vitest";
import { consumeForkPending, markForkPending } from "@/lib/forkPending";

describe("forkPending", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("stores and consumes a single id", () => {
    markForkPending("abc");
    expect(consumeForkPending()).toBe("abc");
    expect(consumeForkPending()).toBeNull();
  });

  it("returns null when nothing stored", () => {
    expect(consumeForkPending()).toBeNull();
  });
});
