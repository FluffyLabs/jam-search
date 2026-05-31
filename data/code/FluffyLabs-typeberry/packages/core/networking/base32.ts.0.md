---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/base32.ts#L1-L31
title: packages/core/networking/base32.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: de3c651b414f14ba194e0c8d7a587578a0963b689470c7f83ba9df54f6382fe8
language: typescript
---
`packages/core/networking/base32.ts` (lines 1–31)

```typescript
/**
 * Custom base32 encoding used for networking.
 *
 * This is not matching the RFC 4648 because of
 * bit ordering.
 *
 * NOTE [ToDr] consider optimizing.
 */
export function base32(input: Uint8Array) {
  function getBit(i: number) {
    const byte = i >> 3;
    const bit = i % 8;

    const val = input.at(byte) ?? 0;
    const ret = (val >> bit) & 0x1;
    return ret;
  }

  const res: string[] = [];
  for (let i = 0; i < input.length * 8; i += 5) {
    let num = 0;
    for (let j = i + 4; j >= i; j--) {
      num <<= 1;
      num |= getBit(j);
    }
    res.push(ALPHABET[num]);
  }
  return res.join("");
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";
```
