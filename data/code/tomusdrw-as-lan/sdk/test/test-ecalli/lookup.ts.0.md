---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/lookup.ts#L1-L49
title: sdk/test/test-ecalli/lookup.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1d73d5e3093bf088bc637956dbb45b548394789b14e9d9f2f68223600fbd07cf
language: typescript
---
`sdk/test/test-ecalli/lookup.ts` (lines 1–49)

```typescript
import { Bytes32, BytesBlob } from "../../core/bytes";

// @ts-expect-error: decorator
@external("ecalli", "setLookupPreimage")
declare function _setLookupPreimage(ptr: u32, len: u32): void;

// @ts-expect-error: decorator
@external("ecalli", "setLookupNone")
declare function _setLookupNone(): void;

// @ts-expect-error: decorator
@external("ecalli", "setPreimageAttached")
declare function _setPreimageAttached(hash_ptr: u32, preimage_ptr: u32, preimage_len: u32): void;

// @ts-expect-error: decorator
@external("ecalli", "clearPreimageAttachments")
declare function _clearPreimageAttachments(): void;

/** Configure the lookup() stub. */
export class TestLookup {
  /** Set preimage data returned by lookup() (single-preimage fallback slot). */
  static setPreimage(data: Uint8Array): void {
    _setLookupPreimage(u32(data.dataStart), data.byteLength);
  }

  /** Make lookup() return NONE (preimage not found). */
  static setNone(): void {
    _setLookupNone();
  }

  /**
   * Simulate a preimage arriving via the `xtpreimages` block extrinsic.
   *
   * Subsequent `lookup(hash)` ecalli calls will return `preimage`,
   * regardless of service id. Use this to emulate the out-of-band
   * preimage delivery path (CE 142 gossip + xtpreimages inclusion)
   * in tests without calling `provide` from the service.
   *
   * Attached entries take precedence over `setPreimage` / `setNone`.
   */
  static setAttachedPreimage(hash: Bytes32, preimage: BytesBlob): void {
    _setPreimageAttached(hash.ptr(), preimage.ptr(), preimage.length);
  }

  /** Clear all attached preimages (keeps the single-preimage fallback slot). */
  static clearAttachedPreimages(): void {
    _clearPreimageAttachments();
  }
}
```
