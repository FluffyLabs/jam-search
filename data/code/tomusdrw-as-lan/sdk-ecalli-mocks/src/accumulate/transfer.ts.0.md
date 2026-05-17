---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/accumulate/transfer.ts#L1-L21
title: sdk-ecalli-mocks/src/accumulate/transfer.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f5d4a3c6093479fa2de0189959f1fc3d4e977e2d257d3544e69d08277ab4be3a
language: typescript
---
`sdk-ecalli-mocks/src/accumulate/transfer.ts` (lines 1–21)

```typescript
// Ecalli 20: Transfer funds. Configurable result.

let transferResult = 0n;

/** Ecalli 20: Transfer balance to another service. */
export function transfer(
  _dest: number,
  _amount: bigint,
  _gas_fee: bigint,
  _memo_ptr: number,
): bigint {
  return transferResult;
}

export function setTransferResult(result: bigint): void {
  transferResult = result;
}

export function resetTransfer(): void {
  transferResult = 0n;
}
```
