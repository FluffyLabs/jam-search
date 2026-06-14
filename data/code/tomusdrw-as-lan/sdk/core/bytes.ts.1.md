---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/bytes.ts#L151-L213'
title: sdk/core/bytes.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: f83f9eb5461b526fda0671dace85aa6bb10bbc0aa8466e23cea6c53c43c527b5
language: typescript
---
`sdk/core/bytes.ts` (lines 151–213)

```typescript
  @inline()
  ptr(): u32 {
    return u32(this.raw.dataStart);
  }

  toString(): string {
    return this.bytes.toString();
  }
}

// ASCII codes for '0', '9', 'a', 'f', 'A', 'F'. Inlined here rather than
// derived from `"0".charCodeAt(0)` etc. — AS evaluates `charCodeAt` at
// module-init (`~start`), which re-runs on every PVM invocation and
// emits dead `String#charCodeAt` calls into every service.
const CODE_OF_0: i32 = 0x30;
const CODE_OF_9: i32 = 0x39;
const CODE_OF_a: i32 = 0x61;
const CODE_OF_f: i32 = 0x66;
const CODE_OF_A: i32 = 0x41;
const CODE_OF_F: i32 = 0x46;
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
