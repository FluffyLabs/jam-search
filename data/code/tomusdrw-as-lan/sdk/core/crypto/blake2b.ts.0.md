---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/crypto/blake2b.ts#L1-L91'
title: sdk/core/crypto/blake2b.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 1e82d2f77d67192bd8cbbc8e8297610c30e6a83d818327c536ec0fbd0c8dceac
language: typescript
---
`sdk/core/crypto/blake2b.ts` (lines 1–91)

```typescript
// Blake2b-256 (RFC 7693), unkeyed, 32-byte output.
//
// Pure-AS implementation validated against RFC test vectors and tuned
// for PVM wasm size / runtime cost:
//   - StaticArray<u64> for h, v, block — no growable-Array GC / bounds-check overhead.
//   - Flat SIGMA[192] StaticArray<u8> — one array load per round, no nested
//     inner-array boxing.
//   - Final block is read directly into `block[]` via bit-packing, skipping
//     the 128-byte Uint8Array copy the reference impl used.
//   - readLE64 / writeLE64 use native `load<u64>` / `store<u64>` (wasm is
//     little-endian; alignment is a hint, unaligned access permitted).
//
// The high 64 bits of the RFC 7693 counter (`t[1]`) are hardcoded 0. Any
// single input up to 2^64 - 1 bytes fits; this does NOT support chained
// hashing of arbitrarily long streams.

const IV: StaticArray<u64> = [
  0x6a09e667f3bcc908, 0xbb67ae8584caa73b, 0x3c6ef372fe94f82b, 0xa54ff53a5f1d36f1, 0x510e527fade682d1,
  0x9b05688c2b3e6c1f, 0x1f83d9abfb41bd6b, 0x5be0cd19137e2179,
];

// SIGMA flattened: 12 rounds × 16 permutation indices. Access: SIGMA[r*16 + i].
const SIGMA: StaticArray<u8> = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8, 12,
  0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2, 4, 10,
  15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9, 12, 5, 1, 15, 14, 13, 4, 10, 0,
  7, 6, 3, 9, 2, 8, 11, 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10, 6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7,
  1, 4, 10, 5, 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
];

@inline
function rotr64(x: u64, n: u32): u64 {
  return (x >> n) | (x << (64 - n));
}

@inline
function g(v: StaticArray<u64>, a: i32, b: i32, c: i32, d: i32, x: u64, y: u64): void {
  v[a] = v[a] + v[b] + x;
  v[d] = rotr64(v[d] ^ v[a], 32);
  v[c] = v[c] + v[d];
  v[b] = rotr64(v[b] ^ v[c], 24);
  v[a] = v[a] + v[b] + y;
  v[d] = rotr64(v[d] ^ v[a], 16);
  v[c] = v[c] + v[d];
  v[b] = rotr64(v[b] ^ v[c], 63);
}

function compress(h: StaticArray<u64>, block: StaticArray<u64>, t: u64, last: bool): void {
  const v = new StaticArray<u64>(16);
  for (let i = 0; i < 8; i += 1) v[i] = h[i];
  for (let i = 0; i < 8; i += 1) v[8 + i] = IV[i];
  v[12] ^= t;
  // v[13] ^= 0 — high 64 bits of counter, hardcoded per module-level caveat.
  if (last) v[14] ^= 0xffffffffffffffff;

  for (let r = 0; r < 12; r += 1) {
    const s: i32 = r * 16;
    g(v, 0, 4, 8, 12, block[SIGMA[s + 0]], block[SIGMA[s + 1]]);
    g(v, 1, 5, 9, 13, block[SIGMA[s + 2]], block[SIGMA[s + 3]]);
    g(v, 2, 6, 10, 14, block[SIGMA[s + 4]], block[SIGMA[s + 5]]);
    g(v, 3, 7, 11, 15, block[SIGMA[s + 6]], block[SIGMA[s + 7]]);
    g(v, 0, 5, 10, 15, block[SIGMA[s + 8]], block[SIGMA[s + 9]]);
    g(v, 1, 6, 11, 12, block[SIGMA[s + 10]], block[SIGMA[s + 11]]);
    g(v, 2, 7, 8, 13, block[SIGMA[s + 12]], block[SIGMA[s + 13]]);
    g(v, 3, 4, 9, 14, block[SIGMA[s + 14]], block[SIGMA[s + 15]]);
  }

  for (let i = 0; i < 8; i += 1) h[i] ^= v[i] ^ v[i + 8];
}

// Native little-endian u64 load/store. Wasm is little-endian, so a direct
// `load<u64>` returns LE bytes as a u64 value. Alignment is a hint only —
// wasm (and PVM) permit unaligned access — so no constraint on the buffer.
@inline
function readLE64(buf: Uint8Array, offset: i32): u64 {
  return load<u64>(buf.dataStart + offset);
}

@inline
function writeLE64(out: Uint8Array, offset: i32, v: u64): void {
  store<u64>(out.dataStart + offset, v);
}

/**
 * Blake2b-256: unkeyed, 32-byte output.
 * Matches RFC 7693 for `outlen=32, key=empty`.
 */
export function blake2b256(input: Uint8Array): Uint8Array {
  // Parameter block for unkeyed 32-byte output:
  //   h[0] ^= 0x0101kknn where kk=keylen=0, nn=outlen=32 → 0x01010020
```
