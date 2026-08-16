---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interface/status.ts#L1-L19
title: packages/core/pvm-interface/status.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d04561013ca995f2d16395ff04201d27a3faf8cfb9506bb8c35736f49c729b07
language: typescript
---
`packages/core/pvm-interface/status.ts` (lines 1–19)

```typescript
/**
 * Result codes for the PVM execution.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/2e43002e4300?v=0.7.2
 */
export enum Status {
  /** Continue */
  OK = 255,
  /** Finished */
  HALT = 0,
  /** Panic */
  PANIC = 1,
  /** Page-fault */
  FAULT = 2,
  /** Host-call */
  HOST = 3,
  /** Out of gas */
  OOG = 4,
}
```
