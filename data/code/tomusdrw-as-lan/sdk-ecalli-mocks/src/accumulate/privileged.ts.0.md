---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/accumulate/privileged.ts#L1-L103
title: sdk-ecalli-mocks/src/accumulate/privileged.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0e6c714f5f5455d59ae2c2dae0754f614fa0c7539e53993fda1d0862d21f36fa
language: typescript
---
`sdk-ecalli-mocks/src/accumulate/privileged.ts` (lines 1–103)

```typescript
// Ecalli 14-16: Privileged governance operations.
//
// bless (14), assign (15), designate (16) — only callable by the
// privileged service (manager/delegator/registrar). Configurable results.

let blessResult = 0n;
let assignResult = 0n;
let designateResult = 0n;

// Bless call capture
let lastBlessManager = 0;
let lastBlessAssignersPtr = 0;
let lastBlessDelegator = 0;
let lastBlessRegistrar = 0;
let lastBlessAutoAccumPtr = 0;
let lastBlessAutoAccumCount = 0;

/** Ecalli 14: Bless — set privileged service configuration. Captures args. */
export function bless(
  _manager: number,
  _assigners_ptr: number,
  _delegator: number,
  _registrar: number,
  _auto_accum_ptr: number,
  _auto_accum_count: number,
): bigint {
  lastBlessManager = _manager;
  lastBlessAssignersPtr = _assigners_ptr;
  lastBlessDelegator = _delegator;
  lastBlessRegistrar = _registrar;
  lastBlessAutoAccumPtr = _auto_accum_ptr;
  lastBlessAutoAccumCount = _auto_accum_count;
  return blessResult;
}

export function getLastBlessManager(): number { return lastBlessManager; }
export function getLastBlessAssignersPtr(): number { return lastBlessAssignersPtr; }
export function getLastBlessDelegator(): number { return lastBlessDelegator; }
export function getLastBlessRegistrar(): number { return lastBlessRegistrar; }
export function getLastBlessAutoAccumPtr(): number { return lastBlessAutoAccumPtr; }
export function getLastBlessAutoAccumCount(): number { return lastBlessAutoAccumCount; }

// Assign call capture
let lastAssignCore = 0;
let lastAssignAuthQueuePtr = 0;
let lastAssignNewAssigner = 0;

/** Ecalli 15: Assign core auth queue. Captures args. */
export function assign(
  _core: number,
  _auth_queue_ptr: number,
  _new_assigner: number,
): bigint {
  lastAssignCore = _core;
  lastAssignAuthQueuePtr = _auth_queue_ptr;
  lastAssignNewAssigner = _new_assigner;
  return assignResult;
}

export function getLastAssignCore(): number { return lastAssignCore; }
export function getLastAssignAuthQueuePtr(): number { return lastAssignAuthQueuePtr; }
export function getLastAssignNewAssigner(): number { return lastAssignNewAssigner; }

// Designate call capture
let lastDesignateValidatorsPtr = 0;

/** Ecalli 16: Designate next epoch validators. Captures args. */
export function designate(
  _validators_ptr: number,
): bigint {
  lastDesignateValidatorsPtr = _validators_ptr;
  return designateResult;
}

export function getLastDesignateValidatorsPtr(): number { return lastDesignateValidatorsPtr; }

export function setBlessResult(result: bigint): void {
  blessResult = result;
}

export function setAssignResult(result: bigint): void {
  assignResult = result;
}

export function setDesignateResult(result: bigint): void {
  designateResult = result;
}

export function resetPrivileged(): void {
  blessResult = 0n;
  assignResult = 0n;
  designateResult = 0n;
  lastBlessManager = 0;
  lastBlessAssignersPtr = 0;
  lastBlessDelegator = 0;
  lastBlessRegistrar = 0;
  lastBlessAutoAccumPtr = 0;
  lastBlessAutoAccumCount = 0;
  lastAssignCore = 0;
  lastAssignAuthQueuePtr = 0;
  lastAssignNewAssigner = 0;
  lastDesignateValidatorsPtr = 0;
}
```
