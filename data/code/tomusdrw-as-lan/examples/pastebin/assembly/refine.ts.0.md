---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/refine.ts#L1-L18
title: examples/pastebin/assembly/refine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6ac3cb22fef1a4c7292fc8ddeb2e38ef3f543c34c5712d54280943c510cb96dc
language: typescript
---
`examples/pastebin/assembly/refine.ts` (lines 1–18)

```typescript
import { Bytes32, blake2b256, RefineContext, Response } from "@fluffylabs/as-lan";
import { PasteDigest } from "./storage";

/**
 * Refine phase: Blake2b-256 the raw payload, emit a PasteDigest (hash ‖ length).
 *
 * Payload shape: raw blob bytes. No tag byte, no envelope — pastebin has a
 * single operation and the entire payload is the blob to be pastebinned.
 */
export function refine(ptr: u32, len: u32): u64 {
  const ctx = RefineContext.create();
  const args = ctx.parseArgs(ptr, len);

  const hash = blake2b256(args.payload.raw);
  const digest = PasteDigest.create(Bytes32.wrapUnchecked(hash), u32(args.payload.length));

  return Response.with(0, digest.encode());
}
```
