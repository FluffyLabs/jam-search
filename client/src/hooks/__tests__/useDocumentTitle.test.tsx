import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const DEFAULT_TITLE = "JAM Search";

afterEach(() => {
  document.title = DEFAULT_TITLE;
});

describe("useDocumentTitle", () => {
  it("appends ' — JAM Search' to a non-empty topic", () => {
    renderHook(() => useDocumentTitle("safrole"));
    expect(document.title).toBe("safrole — JAM Search");
  });

  it("uses the default `JAM Search` when given null", () => {
    document.title = "stale value";
    renderHook(() => useDocumentTitle(null));
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  it("uses the default `JAM Search` when given an empty string", () => {
    document.title = "stale value";
    renderHook(() => useDocumentTitle(""));
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  it("updates the title when the topic changes", () => {
    const { rerender } = renderHook(
      ({ topic }: { topic: string | null }) => useDocumentTitle(topic),
      { initialProps: { topic: "first" as string | null } }
    );
    expect(document.title).toBe("first — JAM Search");
    rerender({ topic: "second" });
    expect(document.title).toBe("second — JAM Search");
    rerender({ topic: null });
    expect(document.title).toBe(DEFAULT_TITLE);
  });

  it("restores the default title on unmount", () => {
    const { unmount } = renderHook(() => useDocumentTitle("topic"));
    expect(document.title).toBe("topic — JAM Search");
    unmount();
    expect(document.title).toBe(DEFAULT_TITLE);
  });
});
