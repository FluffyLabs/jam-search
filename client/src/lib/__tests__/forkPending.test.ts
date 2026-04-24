import { beforeEach, describe, expect, it } from "vitest";
import {
  consumeForkPending,
  markForkPending,
  peekForkPending,
} from "@/lib/forkPending";

describe("forkPending", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("stores and consumes a single id", () => {
    markForkPending("abc");
    expect(consumeForkPending()).toBe("abc");
    expect(consumeForkPending()).toBeNull();
  });

  it("peek does not clear", () => {
    markForkPending("xyz");
    expect(peekForkPending()).toBe("xyz");
    expect(peekForkPending()).toBe("xyz");
    expect(consumeForkPending()).toBe("xyz");
    expect(consumeForkPending()).toBeNull();
  });

  it("returns null when nothing stored", () => {
    expect(consumeForkPending()).toBeNull();
    expect(peekForkPending()).toBeNull();
  });
});
