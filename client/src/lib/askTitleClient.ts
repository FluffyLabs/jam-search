const API_URL =
  (import.meta as unknown as { env: { VITE_API_URL?: string } }).env
    .VITE_API_URL ?? "https://search-api.fluffylabs.dev";

function getApiUrl(): string {
  try {
    const override = window?.localStorage?.getItem?.("API_URL");
    if (override) return override;
  } catch {
    // localStorage may be unavailable (SSR, tests, privacy mode).
  }
  return API_URL;
}

export async function requestTitle(args: {
  question: string;
  openrouterKey: string;
  signal?: AbortSignal;
}): Promise<string | null> {
  let res: Response;
  try {
    res = await fetch(`${getApiUrl()}/ask/title`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question: args.question,
        openrouterKey: args.openrouterKey,
      }),
      signal: args.signal,
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  try {
    const body = (await res.json()) as { title?: string };
    return body.title?.trim() || null;
  } catch {
    return null;
  }
}
