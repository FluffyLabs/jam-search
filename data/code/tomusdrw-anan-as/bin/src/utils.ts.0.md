---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/utils.ts#L1-L29'
title: bin/src/utils.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-20T20:20:54Z'
last_modified: '2026-05-20T20:20:54Z'
chunk_index: 0
chunk_total: 1
content_sha: 6a16e5bb717f4b6966bb1371d301b67ac697ee5d11fa30619ba382f15f345184
language: typescript
---
`bin/src/utils.ts` (lines 1–29)

```typescript
export function hexEncode(result: number[] | Uint8Array, includePrefix = true) {
  const hex = Array.from(result, (x) => x.toString(16).padStart(2, "0")).join("");
  return includePrefix ? `0x${hex}` : hex;
}

export function hexDecode(data: string) {
  if (!data.startsWith("0x")) {
    throw new Error("hex input must start with 0x");
  }

  const hex = data.slice(2);
  const len = hex.length;
  if (len % 2 === 1) {
    throw new Error("Odd number of nibbles");
  }

  const bytes = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    const c = hex.slice(i, i + 2);
    const byteIndex = i / 2;
    if (!/^[0-9a-fA-F]{2}$/.test(c)) {
      throw new Error(`hexDecode: invalid hex pair "${c}" in data "${data}" for bytes[${byteIndex}]`);
    }
    const value = parseInt(c, 16);
    bytes[byteIndex] = value;
  }

  return bytes;
}
```
