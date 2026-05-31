---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/debug.ts#L134-L198
title: packages/core/utils/debug.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 8bf8600e5a1562ec390e04a4198b25f270bbdd5cbc65221db691adcd482a7569
language: typescript
---
`packages/core/utils/debug.ts` (lines 134–198)

```typescript
/** Utility function to measure time taken for some operation [ms]. */
export function measure(id: string) {
  const start = now();
  return () => `${id} took ${(now() - start).toFixed(2)}ms`;
}

const BYTES_IN_MB = 1024 * 1024;
const toMb = (bytes: number) => (bytes / BYTES_IN_MB).toFixed(1);
const signedMb = (bytes: number) => `${bytes >= 0 ? "+" : "-"}${toMb(bytes)}`;

/** Raw process memory usage, or `null` in environments without `process` (e.g. browser). */
function rawMemoryUsage(): NodeJS.MemoryUsage | null {
  if (isBrowser() || typeof process.memoryUsage !== "function") {
    return null;
  }
  return process.memoryUsage();
}

/**
 * Format current process memory usage as a human readable string.
 *
 * Returns an empty string in the browser where `process.memoryUsage` is unavailable.
 *
 * `arrayBuffers` should allow tracking WASM memory, since every instance backs its
 * memory with `ArrayBuffer`.
 */
export function memoryUsage(): string {
  const m = rawMemoryUsage();
  if (m === null) {
    return "";
  }
  return `rss=${toMb(m.rss)}MB heap=${toMb(m.heapUsed)}/${toMb(m.heapTotal)}MB external=${toMb(m.external)}MB arrayBuffers=${toMb(m.arrayBuffers)}MB`;
}

/** Create a stateful memory usage reporter. */
export function memoryTracker(): () => string {
  let prev: NodeJS.MemoryUsage | null = null;
  return () => {
    const m = rawMemoryUsage();
    if (m === null) {
      return "";
    }
    const delta =
      prev === null
        ? ""
        : ` (Δrss=${signedMb(m.rss - prev.rss)}MB ΔarrayBuffers=${signedMb(m.arrayBuffers - prev.arrayBuffers)}MB)`;
    prev = m;
    return `${memoryUsage()}${delta}`;
  };
}

/** A class that adds `toString` method that prints all properties of an object. */
export abstract class WithDebug {
  toString() {
    return inspect(this);
  }
}

export function lazyInspect<T>(obj: T) {
  return {
    toString() {
      return inspect(obj);
    },
  };
}
```
