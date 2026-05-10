---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/state-update.ts#L1-L140
title: packages/jam/state/state-update.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 2
content_sha: 4cd9a52f5c68bc0ca9e4a12d2cca5ef7e30bcea01c54dfcce0ee550c2d0995b8
language: typescript
---
`packages/jam/state/state-update.ts` (lines 1–140)

```typescript
import type { ServiceId, TimeSlot } from "@typeberry/block";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import type { BytesBlob } from "@typeberry/bytes";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import { assertNever } from "@typeberry/utils";
import type { LookupHistoryItem, PreimageItem, ServiceAccountInfo, StorageItem, StorageKey } from "./service.js";

export enum UpdatePreimageKind {
  /**
   * Insert new preimage and optionally update it's lookup history.
   *
   * Used in: `provide`
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/383904383904?v=0.7.2
   */
  Provide = 0,
  /**
   * Remove a preimage and it's lookup history.
   *
   * Used in: `forget` and `eject`
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/38c701380202?v=0.7.2
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/379102379302?v=0.7.2
   */
  Remove = 1,
  /**
   * Update or add lookup history for preimage hash/len to given value.
   *
   * Used in: `solicit` and `forget`
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/382802382802?v=0.7.2
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/384002384b02?v=0.7.2
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/38c60038ea00?v=0.7.2
   */
  UpdateOrAdd = 2,
}
/**
 * A preimage update.
 *
 * Can be one of the following cases:
 * 1. Provide a new preimage blob and set the lookup history to available at `slot`.
 * 2. Remove (forget) a preimage and it's lookup history.
 * 3. Update `LookupHistory` with given value.
 */
export class UpdatePreimage {
  private constructor(
    public readonly action:
      | {
          kind: UpdatePreimageKind.Provide;
          preimage: PreimageItem;
          // optionally set lookup history of that preimage to "available"
          slot: TimeSlot | null;
          providedFor: ServiceId;
        }
      | {
          kind: UpdatePreimageKind.Remove;
          hash: PreimageHash;
          length: U32;
        }
      | {
          kind: UpdatePreimageKind.UpdateOrAdd;
          item: LookupHistoryItem;
        },
  ) {}

  /** A preimage is provided. We should update the lookuphistory and add the preimage to db. */
  static provide({
    preimage,
    slot,
    providedFor,
  }: {
    preimage: PreimageItem;
    slot: TimeSlot | null;
    providedFor: ServiceId;
  }) {
    return new UpdatePreimage({
      kind: UpdatePreimageKind.Provide,
      preimage,
      slot,
      providedFor,
    });
  }

  /** The preimage should be removed completely from the database. */
  static remove({ hash, length }: { hash: PreimageHash; length: U32 }) {
    return new UpdatePreimage({
      kind: UpdatePreimageKind.Remove,
      hash,
      length,
    });
  }

  /** Update the lookup history of some preimage or add a new one (request). */
  static updateOrAdd({ lookupHistory }: { lookupHistory: LookupHistoryItem }) {
    return new UpdatePreimage({
      kind: UpdatePreimageKind.UpdateOrAdd,
      item: lookupHistory,
    });
  }

  get hash(): PreimageHash {
    switch (this.action.kind) {
      case UpdatePreimageKind.Provide:
        return this.action.preimage.hash;
      case UpdatePreimageKind.Remove:
        return this.action.hash;
      case UpdatePreimageKind.UpdateOrAdd:
        return this.action.item.hash;
    }
    throw assertNever(this.action);
  }

  get length(): U32 {
    switch (this.action.kind) {
      case UpdatePreimageKind.Provide:
        return tryAsU32(this.action.preimage.blob.length);
      case UpdatePreimageKind.Remove:
        return this.action.length;
      case UpdatePreimageKind.UpdateOrAdd:
        return this.action.item.length;
    }
    throw assertNever(this.action);
  }
}

/** The type of service update. */
export enum UpdateServiceKind {
  /** Just update the `ServiceAccountInfo`. */
  Update = 0,
  /** Create a new `Service` instance. */
  Create = 1,
}

/**
 * Update service info or create a new one.
 */
export class UpdateService {
  private constructor(
    public readonly action:
      | {
```
