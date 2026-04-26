---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/accumulate.ts#L1-L106
title: examples/pastebin/assembly/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: a20069567379f1ebd8f51b21247b9adacb45da76f71ef313c908569f81d5628f
language: typescript
---
`examples/pastebin/assembly/accumulate.ts` (lines 1–106)

```typescript
import {
  AccumulateContext,
  AccumulatePreimages,
  Bytes32,
  BytesBlob,
  CurrentServiceData,
  Decoder,
  Encoder,
  panic,
  Response,
} from "@fluffylabs/as-lan";
import { CLEANUP_SLOTS_PER_CALL, RECENT_ENTRY_LEN, RECENT_N, REFINE_OUTPUT_LEN, TTL_SLOTS } from "./constants";
import { cleanupCursorKey, expiryKey, PasteDigest, PasteEntry, pasteKey, recentHeadKey, recentKey } from "./storage";

/** Build a 4-byte little-endian u32 BytesBlob (counter / cursor value). */
function u32Blob(value: u32): BytesBlob {
  const e = Encoder.create(4);
  e.u32(value);
  return e.finish();
}

/**
 * Append a 32-byte hash to an `expiry:<slot>` bucket (read-modify-write).
 *
 * If `storage.write` fails (e.g. FULL), the paste won't be scheduled for
 * expiry and will persist indefinitely after the metadata + ring writes
 * above have already succeeded. Acceptable for v1 — a production-hardened
 * service would want to either roll back the prior writes or surface the
 * failure in the accumulate Response.
 */
function appendHashToExpiryBucket(storage: CurrentServiceData, bucketKey: BytesBlob, hash: Bytes32): void {
  const existing = storage.read(bucketKey);
  const prevLen: u32 = existing.isSome ? u32(existing.val!.length) : 0;
  const e = Encoder.create(prevLen + 32);
  if (existing.isSome) e.bytesFixLen(existing.val!);
  e.bytes32(hash);
  storage.write(bucketKey, e.finish());
}

/**
 * Accumulate phase: for each operand whose refine succeeded, solicit the
 * preimage, record metadata, push the hash onto the ring buffer of recent
 * pastes, and schedule expiry for TTL_SLOTS slots later.
 *
 * Re-submission of an already-known hash is a no-op — the first insertion's
 * slot is preserved, which also means the expiry bucket entry is not touched
 * again (only the original submission ages out at the scheduled slot).
 *
 * Transfers are unexpected (pastebin never schedules any) and are skipped.
 */
export function accumulate(ptr: u32, len: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = ctx.parseArgs(ptr, len);
  const fetcher = ctx.fetcher();
  const preimages = ctx.preimages();
  const storage = ctx.serviceData();

  const currentSlot: u32 = args.slot;

  for (let i: u32 = 0; i < args.argsLength; i += 1) {
    const itemOpt = fetcher.oneTransferOrOperand(i);
    if (!itemOpt.isSome) continue;
    const item = itemOpt.val!;
    if (!item.isOperand) continue;
    const operand = item.operand;
    if (!operand.result.isOk) continue;

    const okBlob = operand.result.okBlob;
    // Soft-skip malformed refine output (would otherwise trip PasteDigest.decodeOrPanic).
    if (okBlob.length < REFINE_OUTPUT_LEN) continue;
    const digest = PasteDigest.decodeOrPanic(okBlob);
    const hash = digest.hash;
    const length = digest.length;

    // Idempotency: skip if this paste is already known.
    const existing = storage.read(pasteKey(hash));
    if (!existing.isSome) {
      const solicitRes = preimages.solicit(hash, length);
      if (!solicitRes.isError) {
        // Metadata.
        storage.write(pasteKey(hash), PasteEntry.create(currentSlot, length).encode());

        // Ring buffer of recent pastes: write hash ‖ slot at recent:<head % N>,
        // then bump the head counter.
        const headBlob = storage.read(recentHeadKey());
        const head: u32 = headBlob.isSome ? Decoder.fromBlob(headBlob.val!.raw).u32() : 0;
        const entryEnc = Encoder.create(RECENT_ENTRY_LEN);
        entryEnc.bytes32(hash);
        entryEnc.u32(currentSlot);
        storage.write(recentKey(head % RECENT_N), entryEnc.finish());
        storage.write(recentHeadKey(), u32Blob(head + 1));

        // Expiry bucket.
        const expireAt: u32 = currentSlot + TTL_SLOTS;
        appendHashToExpiryBucket(storage, expiryKey(expireAt), hash);
      }
      // On solicit failure, skip the insertion entirely.
    }
  }

  runCleanup(storage, preimages, currentSlot);

  return Response.with(0);
}

/**
```
