---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/constants.ts#L1-L30
title: examples/pastebin/assembly/constants.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6c203d18b1db460d497f3240e6d6468e0eec2099dec4032a65345ad7cc9af5bc
language: typescript
---
`examples/pastebin/assembly/constants.ts` (lines 1–30)

```typescript
import { BytesBlob } from "@fluffylabs/as-lan";

export const TTL_SLOTS: u32 = 1000;
export const RECENT_N: u32 = 32;
export const CLEANUP_SLOTS_PER_CALL: u32 = 8;

// Byte layout of the refine operand okBlob (= accumulate's input):
//   hash (32-byte Bytes32) ‖ payload_length (u32 LE, 4 bytes) = 36 bytes.
// This is the contract between refine() and accumulate() — changing it must
// update both sides.
export const REFINE_OUTPUT_LEN: i32 = 32 + 4;

// Byte layout of a ring-buffer entry stored under `recent:<idx>`:
//   hash (32-byte Bytes32) ‖ submission_slot (u32 LE, 4 bytes) = 36 bytes.
// Structurally identical to the refine output but semantically distinct
// (slot vs payload-length).
export const RECENT_ENTRY_LEN: i32 = 32 + 4;

// Storage key prefixes. Values are pre-encoded ASCII BytesBlobs to avoid
// pulling in AssemblyScript's full UTF-8 machinery. Each key is built by
// concatenating the prefix with the variable suffix (hash / slot / etc).
export const PREFIX_PASTE: BytesBlob = BytesBlob.encodeAscii("paste:");
export const PREFIX_RECENT: BytesBlob = BytesBlob.encodeAscii("recent:");
export const PREFIX_EXPIRY: BytesBlob = BytesBlob.encodeAscii("expiry:");
// Scalar metadata lives under `meta:` (same namespace as cleanup_cursor). This
// keeps scalar keys structurally disjoint from indexed families (`paste:<hash>`,
// `recent:<u32 LE>`, `expiry:<u32 LE>`) regardless of future RECENT_N changes.
export const KEY_RECENT_HEAD: BytesBlob = BytesBlob.encodeAscii("meta:recent_head");
// Value format: u32 LE — the highest slot whose expiry bucket has been swept.
export const KEY_CLEANUP_CURSOR: BytesBlob = BytesBlob.encodeAscii("meta:cleanup_cursor");
```
