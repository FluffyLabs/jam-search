---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/ecalli-io-tracker.ts#L1-L35
title: packages/core/pvm-host-calls/ecalli-io-tracker.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: cc9395766470f96d16bfccb16394726c7b0a459c187960a1369e6b2d9948bcd5
language: typescript
---
`packages/core/pvm-host-calls/ecalli-io-tracker.ts` (lines 1–35)

```typescript
import type { U32, U64 } from "@typeberry/numbers";
import type { RegisterIndex } from "@typeberry/pvm-interpreter";

/**
 * Interface for tracking PVM I/O operations during host call execution.
 *
 * Implementations record memory reads/writes and register modifications
 * for debugging, tracing, or replay purposes.
 */
export interface IoTracker {
  /** Record a register write operation. */
  setReg(idx: number, val: U64): void;
  /** Record a memory read operation. */
  memRead(address: U32, data: Uint8Array): void;
  /** Record a memory write operation. */
  memWrite(address: U32, data: Uint8Array): void;
  /** Clear all recorded operations. */
  clear(): void;
}

/** Create a no-op tracker that discards all operations. */
export function noopTracker() {
  return new NoopIoTracker();
}

/**
 * No-op implementation that discards all tracked operations.
 * Used when I/O tracing is disabled.
 */
class NoopIoTracker implements IoTracker {
  clear(): void {}
  setReg(_idx: RegisterIndex, _val: U64): void {}
  memRead(_address: U32, _data: Uint8Array): void {}
  memWrite(_address: U32, _data: Uint8Array): void {}
}
```
