---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/bytes.ts#L240-L301
title: packages/core/bytes/bytes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 1adbf354b42b234e0a0c8c3e19778135394933cfcd5fe8d1ec42658a92ed8898
language: typescript
---
`packages/core/bytes/bytes.ts` (lines 240–301)

```typescript
  asOpaque<R>(): Opaque<Bytes<T>, TokenOf<R, Bytes<T>>> {
    return asOpaqueType<Bytes<T>, TokenOf<R, Bytes<T>>>(this);
  }
}

function byteFromString(s: string): number {
  check`${s.length === 2} Two-character string expected`;
  const a = numberFromCharCode(s.charCodeAt(0));
  const b = numberFromCharCode(s.charCodeAt(1));
  return (a << 4) | b;
}

const CODE_OF_0 = "0".charCodeAt(0);
const CODE_OF_9 = "9".charCodeAt(0);
const CODE_OF_a = "a".charCodeAt(0);
const CODE_OF_f = "f".charCodeAt(0);
const CODE_OF_A = "A".charCodeAt(0);
const CODE_OF_F = "F".charCodeAt(0);
const VALUE_OF_A = 0xa;

function numberFromCharCode(x: number) {
  if (x >= CODE_OF_0 && x <= CODE_OF_9) {
    return x - CODE_OF_0;
  }

  if (x >= CODE_OF_a && x <= CODE_OF_f) {
    return x - CODE_OF_a + VALUE_OF_A;
  }

  if (x >= CODE_OF_A && x <= CODE_OF_F) {
    return x - CODE_OF_A + VALUE_OF_A;
  }

  throw new Error(`Invalid characters in hex byte string: ${String.fromCharCode(x)}`);
}

function bytesToHexString(buffer: Uint8Array): string {
  const nibbleToString = (n: number) => {
    if (n >= VALUE_OF_A) {
      return String.fromCharCode(n + CODE_OF_a - VALUE_OF_A);
    }
    return String.fromCharCode(n + CODE_OF_0);
  };

  let s = "0x";
  for (const v of buffer) {
    s += nibbleToString(v >>> 4);
    s += nibbleToString(v & 0xf);
  }
  return s;
}

function u8ArraySameLengthEqual(self: Uint8Array, other: Uint8Array) {
  for (let i = 0; i < self.length; i += 1) {
    if (self[i] !== other[i]) {
      return false;
    }
  }
  return true;
}

export const bytesBlobComparator: Comparator<BytesBlob> = <T extends BytesBlob>(a: T, b: T) => a.compare(b);
```
