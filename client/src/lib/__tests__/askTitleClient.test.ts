import { afterEach, describe, expect, it, vi } from "vitest";
import { requestTitle } from "@/lib/askTitleClient";

function fakeResponse(
  body: unknown,
  init: { ok?: boolean; status?: number } = {},
) {
  const status = init.status ?? 200;
  return {
    ok: init.ok ?? status < 400,
    status,
    json: async () => body,
  } as unknown as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function installFetchMock(fn: ReturnType<typeof vi.fn>) {
  // jsdom's window has its own fetch which we must override explicitly,
  // otherwise code running in window context bypasses globalThis.
  globalThis.fetch = fn as never;
  if (typeof window !== "undefined") {
    (window as unknown as { fetch: typeof fetch }).fetch = fn as never;
  }
}

describe("requestTitle", () => {
  it("posts to /ask/title and returns the title", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      fakeResponse({ title: "Hello world" }),
    );
    installFetchMock(fetchMock);
    const title = await requestTitle({
      question: "Hi there",
      openrouterKey: "k",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/ask\/title$/),
      expect.objectContaining({ method: "POST" }),
    );
    expect(title).toBe("Hello world");
  });

  it("returns null when the endpoint errors", async () => {
    installFetchMock(
      vi.fn().mockResolvedValue(fakeResponse({}, { status: 502 })),
    );
    const title = await requestTitle({ question: "q", openrouterKey: "k" });
    expect(title).toBeNull();
  });

  it("returns null on network error", async () => {
    installFetchMock(vi.fn().mockRejectedValue(new Error("offline")));
    const title = await requestTitle({ question: "q", openrouterKey: "k" });
    expect(title).toBeNull();
  });
});
