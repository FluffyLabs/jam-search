---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/index.ts#L1-L39'
title: sdk/ecalli/index.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 022800ace197544b35dcdff7b4a949edbc4eb774b3179d0a4fc7427ede1356b1
language: typescript
---
`sdk/ecalli/index.ts` (lines 1–39)

```typescript
/**
 * Host call declarations for JAM services.
 *
 * These are extern functions provided by the JAM runtime (PVM host).
 * Each maps to an ecalli instruction at the PVM level.
 *
 * Register mapping conventions:
 * - r7 is the in/out register (first arg and return value)
 * - r8-r12 carry additional arguments
 *
 * @see https://graypaper.fluffylabs.dev/#/ab2cdbd?v=0.7.2
 * @module
 */

/** Return value sentinel constants for ecalli host calls. */
export class EcalliResult {
  /** Item does not exist */
  static readonly NONE: i64 = -1;
  /** Name unknown */
  static readonly WHAT: i64 = -2;
  /** Memory index not accessible */
  static readonly OOB: i64 = -3;
  /** Index unknown */
  static readonly WHO: i64 = -4;
  /** Storage full */
  static readonly FULL: i64 = -5;
  /** Core index unknown */
  static readonly CORE: i64 = -6;
  /** Insufficient funds */
  static readonly CASH: i64 = -7;
  /** Gas limit too low */
  static readonly LOW: i64 = -8;
  /** Invalid operation */
  static readonly HUH: i64 = -9;
}

export * from "./general";
export * from "./refine";
export * from "./accumulate";
```
