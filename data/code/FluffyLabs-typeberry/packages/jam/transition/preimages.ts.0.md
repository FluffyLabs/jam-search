---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/preimages.ts#L1-L94
title: packages/jam/transition/preimages.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: dc4d9d59808d8112ca1f7ede8e24cc9178c01f88fbc0a3a656b07412a3ebe6ec
language: typescript
---
`packages/jam/transition/preimages.ts` (lines 1–94)

```typescript
import type { ServiceId, TimeSlot } from "@typeberry/block";
import type { PreimageHash, PreimagesExtrinsic } from "@typeberry/block/preimage.js";
import type { Blake2b } from "@typeberry/hash";
import { tryAsU32 } from "@typeberry/numbers";
import { LookupHistoryItem, PreimageItem, type ServicesUpdate, type State, UpdatePreimage } from "@typeberry/state";
import { Result } from "@typeberry/utils";

export type PreimagesState = Pick<State, "getService">;

export type PreimagesStateUpdate = Pick<ServicesUpdate, "preimages">;

export type PreimagesInput = {
  preimages: PreimagesExtrinsic;
  slot: TimeSlot;
};

export enum PreimagesErrorCode {
  PreimageUnneeded = "preimage_unneeded",
  PreimagesNotSortedUnique = "preimages_not_sorted_unique",
  AccountNotFound = "account_not_found",
}

export class Preimages {
  constructor(
    public readonly state: PreimagesState,
    public readonly blake2b: Blake2b,
  ) {}

  integrate(input: PreimagesInput): Result<PreimagesStateUpdate, PreimagesErrorCode> {
    // make sure lookup extrinsics are sorted and unique
    // "The lookup extrinsic is a sequence of pairs of service indices and data.
    // These pairs must be ordered and without duplicates."
    // https://graypaper.fluffylabs.dev/#/5f542d7/181700181700
    for (let i = 1; i < input.preimages.length; i++) {
      const prevPreimage = input.preimages[i - 1];
      const currPreimage = input.preimages[i];

      if (prevPreimage.requester < currPreimage.requester) {
        continue;
      }

      if (
        prevPreimage.requester > currPreimage.requester ||
        currPreimage.blob.compare(prevPreimage.blob).isLessOrEqual()
      ) {
        return Result.error(
          PreimagesErrorCode.PreimagesNotSortedUnique,
          () => `Preimages not sorted/unique at index ${i}`,
        );
      }
    }

    const { preimages, slot } = input;
    const pendingChanges = new Map<ServiceId, UpdatePreimage[]>();

    // select preimages for integration
    for (const preimage of preimages) {
      const { requester, blob } = preimage;
      const hash: PreimageHash = this.blake2b.hashBytes(blob).asOpaque();

      const service = this.state.getService(requester);
      if (service === null) {
        return Result.error(PreimagesErrorCode.AccountNotFound, () => `Service not found: ${requester}`);
      }

      const hasPreimage = service.hasPreimage(hash);
      const slots = service.getLookupHistory(hash, tryAsU32(blob.length));
      // https://graypaper.fluffylabs.dev/#/5f542d7/181800181900
      // https://graypaper.fluffylabs.dev/#/5f542d7/116f0011a500
      if (hasPreimage || slots === null || !LookupHistoryItem.isRequested(slots)) {
        return Result.error(
          PreimagesErrorCode.PreimageUnneeded,
          () =>
            `Preimage unneeded: requester=${requester}, hash=${hash}, hasPreimage=${hasPreimage}, isRequested=${slots !== null && LookupHistoryItem.isRequested(slots)}`,
        );
      }

      // https://graypaper.fluffylabs.dev/#/5f542d7/18c00018f300
      const updates = pendingChanges.get(requester) ?? [];
      updates.push(
        UpdatePreimage.provide({
          preimage: PreimageItem.create({ hash, blob }),
          slot,
          providedFor: requester,
        }),
      );
      pendingChanges.set(requester, updates);
    }

    return Result.ok({
      preimages: pendingChanges,
    });
  }
}
```
