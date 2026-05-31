---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/assembly/test-data.ts#L1-L94
title: examples/all-ecalli/assembly/test-data.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8ce50ad2314477acbafdc4a16574efefca5ac15f00c07d365520e32a52ac56d6
language: typescript
---
`examples/all-ecalli/assembly/test-data.ts` (lines 1–94)

```typescript
import { BytesBlob, Encoder } from "@fluffylabs/as-lan";

// ─── Test protocol constants (must match host configuration) ─────────

/** Number of auth queue slots. */
export const AUTH_QUEUE_SLOTS: u32 = 2;
/** Max authorizers per core. */
export const AUTH_QUEUE_AUTHS_PER_CORE: u32 = 2;
/** Number of auto-accumulate service entries. */
export const AUTO_ACCUM_COUNT: u32 = 2;
/** Number of validators. */
export const VALIDATORS_COUNT: u32 = 6;
/** Validator key size: Ed25519(32) + Bandersnatch(32) + BLS(144) + metadata(128). */
const VALIDATOR_KEY_SIZE: u32 = 336;

// ─── AuthQueue ──────────────────────────────────────────────────────

/**
 * Build a test auth queue: slots × authsPerCore code hashes (32 bytes each).
 *
 * Each hash is filled with a test pattern: byte[0]=slot, byte[1]=auth_index,
 * remaining bytes=0xCC so the host can identify each entry.
 */
export function buildAuthQueue(
  slots: u32 = AUTH_QUEUE_SLOTS,
  authsPerCore: u32 = AUTH_QUEUE_AUTHS_PER_CORE,
): BytesBlob {
  const enc = Encoder.create(slots * authsPerCore * 32);
  for (let q: u32 = 0; q < slots; q++) {
    for (let o: u32 = 0; o < authsPerCore; o++) {
      const raw = new Uint8Array(32);
      raw[0] = u8(q);
      raw[1] = u8(o);
      raw.fill(0xcc, 2);
      enc.bytesFixLen(BytesBlob.wrap(raw));
    }
  }
  return enc.finish();
}

// ─── AutoAccumulate ────────────────────────────────────────────────

/**
 * Build a test auto-accumulate service list: count × u32 service IDs.
 *
 * Uses service IDs 100, 200, ... so they're easy to spot on the host side.
 */
export function buildAutoAccum(count: u32 = AUTO_ACCUM_COUNT): BytesBlob {
  const enc = Encoder.create(count * 4);
  for (let i: u32 = 0; i < count; i++) {
    enc.u32((i + 1) * 100);
  }
  return enc.finish();
}

// ─── Validators ────────────────────────────────────────────────────

/**
 * Build test validator keys: count entries, each VALIDATOR_KEY_SIZE bytes.
 *
 * Layout per key: Ed25519(32) + Bandersnatch(32) + BLS(144) + metadata(128).
 * Each section is filled with a marker byte so the host can verify alignment:
 *   Ed25519:      0xE0 | validator_index
 *   Bandersnatch:  0xB0 | validator_index
 *   BLS:          0xBB (first byte = validator_index)
 *   metadata:     0xAA (first byte = validator_index)
 */
export function buildValidators(count: u32 = VALIDATORS_COUNT): BytesBlob {
  const enc = Encoder.create(count * VALIDATOR_KEY_SIZE);
  for (let v: u32 = 0; v < count; v++) {
    // Ed25519 (32 bytes)
    const ed = new Uint8Array(32);
    ed.fill(0xe0 | u8(v));
    enc.bytesFixLen(BytesBlob.wrap(ed));

    // Bandersnatch (32 bytes)
    const band = new Uint8Array(32);
    band.fill(0xb0 | u8(v));
    enc.bytesFixLen(BytesBlob.wrap(band));

    // BLS (144 bytes)
    const bls = new Uint8Array(144);
    bls.fill(0xbb);
    bls[0] = u8(v);
    enc.bytesFixLen(BytesBlob.wrap(bls));

    // metadata (128 bytes)
    const meta = new Uint8Array(128);
    meta.fill(0xaa);
    meta[0] = u8(v);
    enc.bytesFixLen(BytesBlob.wrap(meta));
  }
  return enc.finish();
}
```
