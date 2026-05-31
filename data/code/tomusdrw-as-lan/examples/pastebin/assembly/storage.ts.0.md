---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/storage.ts#L1-L114
title: examples/pastebin/assembly/storage.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 158992acd8941aeb4e4225bed3c7dbc01feccca6ec0d432a28118eaf0868c06f
language: typescript
---
`examples/pastebin/assembly/storage.ts` (lines 1–114)

```typescript
import { Bytes32, BytesBlob, Decoder, Encoder, panic } from "@fluffylabs/as-lan";
import {
  KEY_CLEANUP_CURSOR,
  KEY_RECENT_HEAD,
  PREFIX_EXPIRY,
  PREFIX_PASTE,
  PREFIX_RECENT,
  REFINE_OUTPUT_LEN,
} from "./constants";

/** Build a 4-byte little-endian u32 as a BytesBlob (storage-key suffix helper). */
function u32LE(value: u32): BytesBlob {
  const e = Encoder.create(4);
  e.u32(value);
  return e.finish();
}

/** Concatenate two BytesBlobs into a new one (prefix + suffix for storage keys). */
function concatBytes(a: BytesBlob, b: BytesBlob): BytesBlob {
  const e = Encoder.create(a.length + b.length);
  e.bytesFixLen(a);
  e.bytesFixLen(b);
  return e.finish();
}

export function pasteKey(hash: Bytes32): BytesBlob {
  return concatBytes(PREFIX_PASTE, hash.bytes);
}

export function recentKey(idx: u32): BytesBlob {
  return concatBytes(PREFIX_RECENT, u32LE(idx));
}

export function expiryKey(slot: u32): BytesBlob {
  return concatBytes(PREFIX_EXPIRY, u32LE(slot));
}

export function recentHeadKey(): BytesBlob {
  return KEY_RECENT_HEAD;
}
export function cleanupCursorKey(): BytesBlob {
  return KEY_CLEANUP_CURSOR;
}

// ─── PasteDigest codec ─────────────────────────────────────────────────────
// Wire format between refine and accumulate (operand okBlob contents).
// Fixed REFINE_OUTPUT_LEN layout: (hash: bytes32, payload_length: u32 LE).
//
// Kept alongside PasteEntry because both are small fixed-layout pastebin
// records and share the same Encoder/Decoder idiom.

export class PasteDigest {
  static create(hash: Bytes32, length: u32): PasteDigest {
    return new PasteDigest(hash, length);
  }
  private constructor(
    public readonly hash: Bytes32,
    public readonly length: u32,
  ) {}

  encode(): BytesBlob {
    const e = Encoder.create(REFINE_OUTPUT_LEN);
    e.bytes32(this.hash);
    e.u32(this.length);
    return e.finish();
  }

  /**
   * Decode an operand okBlob into a PasteDigest.
   *
   * Panics on too-short input. Callers consuming untrusted refine output
   * (e.g. accumulate) should length-guard upstream with
   * `okBlob.length < REFINE_OUTPUT_LEN` to choose "skip" over "panic".
   * Trailing bytes beyond the fixed layout are ignored.
   */
  static decodeOrPanic(raw: BytesBlob): PasteDigest {
    if (raw.length < REFINE_OUTPUT_LEN) panic("PasteDigest: expected at least 36 bytes");
    const d = Decoder.fromBytesBlob(raw);
    const hash = d.bytes32();
    const length = d.u32();
    return new PasteDigest(hash, length);
  }
}

// ─── PasteEntry codec ──────────────────────────────────────────────────────
// Fixed 8-byte layout: (submission_slot: u32 LE, length: u32 LE).

export class PasteEntry {
  static create(slot: u32, length: u32): PasteEntry {
    return new PasteEntry(slot, length);
  }
  private constructor(
    public readonly slot: u32,
    public readonly length: u32,
  ) {}

  encode(): BytesBlob {
    const e = Encoder.create(8);
    e.u32(this.slot);
    e.u32(this.length);
    return e.finish();
  }

  static decodeOrPanic(raw: Uint8Array): PasteEntry {
    // Explicit check + panic() — `assert()` is stripped under `noAssert: true`
    // in the release target (asconfig.json), which would turn a wrong-length
    // buffer into a silent zero-filled PasteEntry instead of a trap.
    if (raw.length !== 8) panic("PasteEntry: expected 8 bytes");
    const d = Decoder.fromBlob(raw);
    const slot = d.u32();
    const length = d.u32();
    return new PasteEntry(slot, length);
  }
}
```
