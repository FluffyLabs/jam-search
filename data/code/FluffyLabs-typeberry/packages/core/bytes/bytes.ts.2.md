---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/bytes.ts#L240-L310
title: packages/core/bytes/bytes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 5347a8684a60028eac3404e7c9d41554968fdfbeba49400aeae89162c454b8ed
language: typescript
---
`packages/core/bytes/bytes.ts` (lines 240–310)

```typescript
  asOpaque<R>(): Opaque<Bytes<T>, TokenOf<R, Bytes<T>>> {
    return asOpaqueType<Bytes<T>, TokenOf<R, Bytes<T>>>(this);
  }

  toStringTruncated() {
    if (this.raw.length > 8) {
      const start = bytesToHexString(this.raw.subarray(0, 2));
      const end = bytesToHexString(this.raw.subarray(this.raw.length - 2));
      return `${start}...${end.substring(2)}`;
    }
    return `${this.toString()}`;
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
