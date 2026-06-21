---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/debug.ts#L135-L222
title: packages/core/utils/debug.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: a077dd390b84e6613535c0dbd7f719c391f636182355700107571e040e49c376
language: typescript
---
`packages/core/utils/debug.ts` (lines 135–222)

```typescript
 * Utility function to measure time taken for some operation [ms].
 *
 * To reduce allocations, each timer can only track one entry.
 *
 */
export function measure(id: string) {
  const response = {
    id,
    start: 0,
    duration() {
      return now() - this.start;
    },
    toString() {
      return `${this.id} took ${(this.duration()).toFixed(2)}ms`;
    },
  };

  return () => {
    response.start = now();
    return response;
  };
}

const BYTES_IN_MB = 1024 * 1024;
const toMb = (bytes: number) => (bytes / BYTES_IN_MB).toFixed(1);
const signedMb = (bytes: number) => `${bytes >= 0 ? "+" : ""}${toMb(bytes)}`;

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
export function memoryUsage(withDetails: boolean): string {
  const m = rawMemoryUsage();
  if (m === null) {
    return "";
  }
  if (withDetails) {
    return `rss=${toMb(m.rss)}MB heap=${toMb(m.heapUsed)}/${toMb(m.heapTotal)}MB external=${toMb(m.external)}MB arrayBuffers=${toMb(m.arrayBuffers)}MB`;
  }

  return `rss=${toMb(m.rss)}MB heap=${toMb(m.heapUsed)}/${toMb(m.heapTotal)}MB`;
}

/** Create a stateful memory usage reporter. */
export function memoryTracker(withDetails: boolean): { toString(): string } {
  let prev: NodeJS.MemoryUsage | null = null;
  return {
    toString() {
      const m = rawMemoryUsage();
      if (m === null) {
        return "";
      }
      const delta =
        prev === null || withDetails === false
          ? ""
          : ` (Δrss=${signedMb(m.rss - prev.rss)}MB ΔarrayBuffers=${signedMb(m.arrayBuffers - prev.arrayBuffers)}MB)`;
      prev = m;
      return `${memoryUsage(withDetails)}${delta}`;
    },
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
