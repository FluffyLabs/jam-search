---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/arguments.ts#L126-L172'
title: assembly/arguments.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 4db22f6898cc811a1e93430050d5519da64c968ae7857397336f317c22c27b29
language: typescript
---
`assembly/arguments.ts` (lines 126–172)

```typescript
    const hig = higNibble(data[o]);
    const low = lowNibble(data[o]);
    const result = twoImm(args, data, o + 1, lim);
    return args.fill(hig, low, result.a, result.b);
  },
  // DECODERS[Arguments.ThreeReg] =
  (args, data, o, _lim) => {
    const hig = higNibble(data[o]);
    const low = lowNibble(data[o]);
    const b = lowNibble(data[o + 1]);
    return args.fill(hig, low, b, 0);
  },
]);

// @inline
export function lowNibble(byte: u8): u8 {
  return byte & 0xf;
}
export function higNibble(byte: u8): u8 {
  return byte >> 4;
}

//@inline
function decodeI32(input: StaticArray<u8>, start: u32, end: u32): u32 {
  if (end <= start) {
    return 0;
  }
  const l = end - start;
  const len = l < 4 ? l : 4;
  let num = 0x0;
  for (let i: u32 = 0; i < len; i++) {
    num |= u32(input[start + i]) << (i * 8);
  }
  const msb = portable.staticArrayAt(input, start + len - 1) & 0x80;
  if (len < 4 && msb > 0) {
    num |= 0xffff_ffff << (len * 8);
  }
  return num;
}

function decodeU32(data: StaticArray<u8>, offset: u32): u32 {
  let num = u32(data[offset + 0]);
  num |= u32(data[offset + 1]) << 8;
  num |= u32(data[offset + 2]) << 16;
  num |= u32(data[offset + 3]) << 24;
  return portable.asU32(num);
}
```
