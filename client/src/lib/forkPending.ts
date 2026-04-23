const KEY = "ask.pendingFork";

export function markForkPending(sessionId: string): void {
  try {
    window.sessionStorage.setItem(KEY, sessionId);
  } catch {
    // sessionStorage may be unavailable.
  }
}

export function consumeForkPending(): string | null {
  try {
    const v = window.sessionStorage.getItem(KEY);
    if (v) window.sessionStorage.removeItem(KEY);
    return v ?? null;
  } catch {
    return null;
  }
}
