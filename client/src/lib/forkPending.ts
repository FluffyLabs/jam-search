const KEY = "ask.pendingFork";

export function markForkPending(sessionId: string): void {
  try {
    window.sessionStorage.setItem(KEY, sessionId);
  } catch {
    // sessionStorage may be unavailable.
  }
}

/** Read without clearing. Used by the auth callback to decide where to
 *  redirect after login — the AskSharedPage consumes the token to actually
 *  perform the fork. */
export function peekForkPending(): string | null {
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
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
