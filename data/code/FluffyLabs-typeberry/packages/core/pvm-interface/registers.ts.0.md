---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interface/registers.ts#L1-L18
title: packages/core/pvm-interface/registers.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 70a1acb2043a0ae032dfb5a02aa5569deb884caf2768f5c875c75255a997caac
language: typescript
---
`packages/core/pvm-interface/registers.ts` (lines 1–18)

```typescript
export const NO_OF_REGISTERS = 13;
export const REGISTER_BYTE_SIZE = 8;

/** Allow to set and get all registers encoded into little-endian bytes. */
export interface IRegisters {
  /**
   * Get all registers encoded into little-endian bytes.
   *
   * NOTE: Total length of bytes must be NO_OF_REGISTERS * REGISTER_BYTE_SIZE.
   */
  getAllEncoded(): Uint8Array;
  /**
   * Set all registers from little-endian encoded bytes.
   *
   * NOTE: Total length of bytes must be NO_OF_REGISTERS * REGISTER_BYTE_SIZE.
   */
  setAllEncoded(bytes: Uint8Array): void;
}
```
