---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/crypto/blake2b.ts#L87-L125
title: sdk/core/crypto/blake2b.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 74dc1776a41bff879133dc6c357ff9265642c89485c583285b51203e9a62b1e0
language: typescript
---
`sdk/core/crypto/blake2b.ts` (lines 87–125)

```typescript
 * Matches RFC 7693 for `outlen=32, key=empty`.
 */
export function blake2b256(input: Uint8Array): Uint8Array {
  // Parameter block for unkeyed 32-byte output:
  //   h[0] ^= 0x0101kknn where kk=keylen=0, nn=outlen=32 → 0x01010020
  const h = new StaticArray<u64>(8);
  for (let i = 0; i < 8; i += 1) h[i] = IV[i];
  h[0] ^= 0x0101_0020;

  const block = new StaticArray<u64>(16);
  const inLen = input.length;
  let t: u64 = 0;
  let offset: i32 = 0;

  // Compress all full 128-byte blocks except the last.
  // Strict > so that inputs that are an exact multiple of 128 still have a final block
  // (RFC 7693 requires the last compression to be flagged with f0 = 0xff…ff).
  while (inLen - offset > 128) {
    for (let i = 0; i < 16; i += 1) block[i] = readLE64(input, offset + i * 8);
    t += 128;
    compress(h, block, t, false);
    offset += 128;
  }

  // Final block (may be partial; even empty input ends here with a zero block).
  // Bit-pack the remaining `finalLen` bytes directly into `block` u64 words —
  // skips the 128-byte Uint8Array the reference impl allocated + two copy passes.
  const finalLen = inLen - offset;
  for (let i = 0; i < 16; i += 1) block[i] = 0;
  for (let i = 0; i < finalLen; i += 1) {
    block[i >> 3] |= u64(input[offset + i]) << u64((i & 7) * 8);
  }
  t += u64(finalLen);
  compress(h, block, t, true);

  const out = new Uint8Array(32);
  for (let i = 0; i < 4; i += 1) writeLE64(out, i * 8, h[i]);
  return out;
}
```
