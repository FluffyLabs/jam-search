# /ask UI fixes — design

Nine scoped fixes to the `/ask` feature: layout, session switching, dropdown parity, session list sync, link correctness, share UX.

## 1. Padding consistency

**Problem:** `App.tsx:96` sets `fullBleed = pathname === "/ask"`. Only the empty state skips the shell's `p-4`; `/ask/:sessionId` gets double padding.

**Fix:** Widen the match so any `/ask` subpath is full-bleed, except the shared view (it renders its own `p-4 mx-auto max-w-5xl`).

```ts
const fullBleed = pathname === "/ask" || pathname.startsWith("/ask/");
```

`/ask/s/:id` is also `/ask/...`, which is fine: removing the outer `p-4` there just lets the shared page's internal padding stand alone, eliminating the existing double-pad.

## 2. Session switching is broken

**Problem:** `ask.tsx:64–69` has a `createdRef` that marks just-created session ids so we skip the initial hydrate round-trip. It never clears. Sequence *create A → switch to B → click A in sidebar* sees `createdRef.has(A)`, short-circuits with B still in state.

**Fix:** Delete the entry after consuming it once:

```ts
if (createdRef.current.has(sessionId)) {
  createdRef.current.delete(sessionId);
  hydratedRef.current = sessionId;
  return;
}
```

## 3. Missing `text-foreground`

**Problem:** `SessionsSidebar`'s `bg-card/50` aside and `SessionRow`'s link lack an explicit foreground color; they inherit from parents that may or may not resolve to a readable value in dark mode.

**Fix:** Audit the `/ask` tree and add `text-foreground` only where color drifts — sidebar root, session row links, sticky header text. No shotgun sweep.

## 4. Dropdown parity

**Problem:** `ModelPicker` uses `DropdownMenuLabel` + `DropdownMenuSeparator` with muted styling, giving a clear hierarchy. `SessionRow`'s dropdown is bare items.

**Fix:** Give `SessionRow`'s dropdown the same structural pattern (label row, separator, items). The "shared component" is the base `dropdown-menu.tsx` primitives — consolidate any styling defaults there so both pickers render consistently without wrapping in a second abstraction.

## 5. Sessions randomly appear/disappear

**Problem:** `useSessions()` is called twice — once in `AskLayout` (sidebar) and once in `AskPage` (page). Each instance has its own `useState`-backed `sessions` array. A mutation in one doesn't propagate to the other.

**Fix:** Rewrite `useSessions` on top of `@tanstack/react-query` (already installed, already used by `useResults`, etc.). All consumers share the cache via `queryKey: ["ask_sessions", userId]`; mutations call `queryClient.invalidateQueries`.

Side effect: removes the `createUseSessions(deps)()` factory, which was a workaround for needing `supabase`/`userId` in callbacks; react-query mutations close over those naturally.

API surface stays shape-compatible with the existing consumers:

```ts
interface UseSessionsApi {
  sessions: AskSessionSummary[] | undefined;
  error: string | null;
  list: () => Promise<void>;     // exposed for parity; mostly unused after refactor
  get: (id: string) => Promise<AskSessionRecord | null>;
  create: (...) => Promise<void>;
  update: (...) => Promise<void>;
  remove: (id: string) => Promise<void>;
}
```

## 6. Remove "New chat" from the main section

`ask.tsx:349–351` renders a "New chat" button in the sticky header. The sidebar already has one. Delete the button and its `handleNewChat` wiring if nothing else uses it.

## 7. Graypaper link is wrong

**Problem:** `buildGraypaperUrl(title)` in `backend/src/ask/tools.ts:50–53` produces `?section=${encodeURIComponent(title)}`. Search pages produce `?search=${query}&section=${section.title}` with no URL encoding. The Graypaper reader is broken for the /ask form.

**Fix:** Match the search-page format byte-for-byte:
- Plumb `args.query` from `executeSearchAll(args, …)` into `buildGraypaperUrl(title, query)`.
- Emit `https://graypaper.fluffylabs.dev/#/?search=${query}&section=${title}` with no encoding (matches search pages).
- For `executeGetFullDocument`, no query is available; pass an empty string so the URL is `?search=&section=${title}` (still valid per reader expectations).

Parity with the existing search-results behavior is the correct baseline. If any section/query value contains `&` or `#` and breaks the hash route, that's a separate pre-existing bug affecting both the search UI and /ask equally.

## 8. Remove "Regenerate title"

Remove the menu item from `SessionRow`, the prop from `SessionsSidebar`, and the `onRegenerateTitle` handler in `AskLayout`. `requestTitle` remains used during initial creation in `ask.tsx`.

## 9. Dropdown Share → flip public + copy + toast

**Behavior:** Clicking the "Share" item in `SessionRow`'s dropdown:
1. If the session is not public, calls `sessions.update(id, { isPublic: true })`.
2. Copies the shareable link (`${origin}${pathname}#/ask/s/${id}`) to the clipboard.
3. Shows a toast: "Link copied. Session is public now" if we flipped it, "Link copied" if it was already public.

**Toast infrastructure:** Add `sonner` dependency and mount `<Toaster />` in `App.tsx`. Lightweight, shadcn-native, matches the existing UI patterns.

`SharePopover` on the session header stays as-is for the "make private again" affordance.

## Out of scope

- Streaming-during-switch race (dispatches from an aborted stream for session A arriving after hydrate of B).
- Pre-existing bug where graypaper section titles with `&`/`#` break the reader's hash route.
- Real-time multi-tab session sync (a user modifying sessions in another tab still won't see updates without a refetch).
