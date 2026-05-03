---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/bytes.ts#L148-L209'
title: sdk/core/bytes.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 8cfe56243f9ac9ff2511aa33a595a8e3597da3b1846176b9fca5a196da6eecbb
language: typescript
---
`sdk/core/bytes.ts` (lines 148–209)

```typescript
    return this.raw.length;
  }

  @inline()
  ptr(): u32 {
    return u32(this.raw.dataStart);
  }

  toString(): string {
    return this.bytes.toString();
  }
}

const CODE_OF_0: i32 = "0".charCodeAt(0);
const CODE_OF_9: i32 = "9".charCodeAt(0);
const CODE_OF_a: i32 = "a".charCodeAt(0);
const CODE_OF_f: i32 = "f".charCodeAt(0);
const CODE_OF_A: i32 = "A".charCodeAt(0);
const CODE_OF_F: i32 = "F".charCodeAt(0);
const VALUE_OF_A: i32 = 0xa;

function byteFromString(s: string): U8WithError {
  const a = numberFromCharCode(s.charCodeAt(0));
  const b = numberFromCharCode(s.charCodeAt(1));
  if (u8IsError(a) || u8IsError(b)) {
    return u8WithError(0, 0xff);
  }
  return (u8(a) << 4) | u8(b);
}

function numberFromCharCode(x: i32): u16 {
  if (x >= CODE_OF_0 && x <= CODE_OF_9) {
    return u16(x - CODE_OF_0);
  }

  if (x >= CODE_OF_a && x <= CODE_OF_f) {
    return u16(x - CODE_OF_a + VALUE_OF_A);
  }

  if (x >= CODE_OF_A && x <= CODE_OF_F) {
    return u16(x - CODE_OF_A + VALUE_OF_A);
  }

  return u8WithError(0, 0xff);
}

function bytesToHexString(buffer: Uint8Array): string {
  const nibbleToString = (n: i32): string => {
    if (n >= VALUE_OF_A) {
      return String.fromCharCode(n + CODE_OF_a - VALUE_OF_A);
    }
    return String.fromCharCode(n + CODE_OF_0);
  };

  let s = "0x";
  for (let i = 0; i < buffer.length; i++) {
    const v = buffer[i];
    s += nibbleToString(v >>> 4);
    s += nibbleToString(v & 0xf);
  }
  return s;
}
```
