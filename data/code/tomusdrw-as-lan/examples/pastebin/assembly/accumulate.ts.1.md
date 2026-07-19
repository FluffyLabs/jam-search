---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/accumulate.ts#L95-L158
title: examples/pastebin/assembly/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 4f20f26b99c9771fffb54d235c587ce5cdc43a83c425061ffbe8c1b0a0b6dd11
language: typescript
---
`examples/pastebin/assembly/accumulate.ts` (lines 95–158)

```typescript
        appendHashToExpiryBucket(storage, expiryKey(expireAt), hash);
      }
      // On solicit failure, skip the insertion entirely.
    }
  }

  runCleanup(storage, preimages, currentSlot);

  return Response.with(0);
}

/**
 * Reclaim expired pastes. Walks at most CLEANUP_SLOTS_PER_CALL expiry buckets
 * forward from the persisted cursor, bounded by `currentSlot`. For each paste
 * hash in a swept bucket: forget the preimage (ignoring failure — the record
 * is being deleted either way) and delete the metadata entry. The bucket key
 * itself is also deleted. The cursor advances monotonically and is persisted
 * only when it moves forward.
 */
function runCleanup(storage: CurrentServiceData, preimages: AccumulatePreimages, currentSlot: u32): void {
  // Read current cursor (u32 LE). Absent on the first sweep → start at 0.
  // A wrong-length blob is host-contract corruption (the only writer is this
  // function, which always writes exactly 4 bytes) — panic, matching
  // PasteEntry.decodeOrPanic's posture on malformed internal records.
  const cursorBlob = storage.read(cleanupCursorKey());
  let cursor: u32 = 0;
  if (cursorBlob.isSome) {
    const raw = cursorBlob.val!;
    if (raw.length !== 4) panic("cleanup cursor: expected 4 bytes");
    cursor = Decoder.fromBytesBlob(raw).u32();
  }

  // Walk at most CLEANUP_SLOTS_PER_CALL slots forward, bounded by currentSlot.
  const limit: u32 = cursor + CLEANUP_SLOTS_PER_CALL;
  const target: u32 = limit < currentSlot ? limit : currentSlot;

  for (let s: u32 = cursor + 1; s <= target; s += 1) {
    const bucketKey = expiryKey(s);
    const bucket = storage.read(bucketKey);
    if (!bucket.isSome) continue;

    // Bucket holds a packed list of 32-byte hashes — decode with the standard codec.
    const d = Decoder.fromBytesBlob(bucket.val!);
    const bucketLen = u32(bucket.val!.length);
    while (u32(d.bytesRead()) + 32 <= bucketLen) {
      const hash = d.bytes32();

      const entryBlob = storage.read(pasteKey(hash));
      if (entryBlob.isSome) {
        const entry = PasteEntry.decodeOrPanic(entryBlob.val!.raw);
        // forget result ignored: the paste metadata is being deleted either way.
        preimages.forget(hash, entry.length);
        storage.write(pasteKey(hash), BytesBlob.empty());
      }
    }
    // Delete the bucket itself.
    storage.write(bucketKey, BytesBlob.empty());
  }

  // Persist new cursor only if it advanced.
  if (target > cursor) {
    storage.write(cleanupCursorKey(), u32Blob(target));
  }
}
```
