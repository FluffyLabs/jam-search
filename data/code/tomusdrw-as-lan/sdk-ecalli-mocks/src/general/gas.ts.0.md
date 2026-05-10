---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/general/gas.ts#L1-L15
title: sdk-ecalli-mocks/src/general/gas.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a9765bb287f9c0cafbd4e0f0c41c8c4ab571ff4dc5eb854aea1776910219e16d
language: typescript
---
`sdk-ecalli-mocks/src/general/gas.ts` (lines 1–15)

```typescript
const DEFAULT_GAS = 1_000_000n;

let gasValue: bigint = DEFAULT_GAS;

export function setGasValue(value: bigint): void {
  gasValue = value;
}

export function gas(): bigint {
  return gasValue;
}

export function resetGas(): void {
  gasValue = DEFAULT_GAS;
}
```
