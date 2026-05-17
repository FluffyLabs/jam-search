---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/service.ts#L131-L231
title: packages/jam/state/service.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 376ece9335d17552b2d254962c729559348490530771605013906581682d3dd4
language: typescript
---
`packages/jam/state/service.ts` (lines 131–231)

```typescript
    /** `a_c`: Hash of the service code. */
    public readonly codeHash: CodeHash,
    /** `a_b`: Current account balance. */
    public readonly balance: U64,
    /** `a_g`: Minimal gas required to execute Accumulate entrypoint. */
    public readonly accumulateMinGas: ServiceGas,
    /** `a_m`: Minimal gas required to execute On Transfer entrypoint. */
    public readonly onTransferMinGas: ServiceGas,
    /** `a_o`: Total number of octets in storage. */
    public readonly storageUtilisationBytes: U64,
    /** `a_f`: Cost-free storage. Decreases both storage item count and total byte size. */
    public readonly gratisStorage: U64,
    /** `a_i`: Number of items in storage. */
    public readonly storageUtilisationCount: U32,
    /** `a_r`: Creation account time slot. */
    public readonly created: TimeSlot,
    /** `a_a`: Most recent accumulation time slot. */
    public readonly lastAccumulation: TimeSlot,
    /** `a_p`: Parent service ID. */
    public readonly parentService: ServiceId,
  ) {
    super();
  }
}

export type ServiceAccountInfoView = DescribedBy<typeof ServiceAccountInfo.Codec.View>;

export class PreimageItem extends WithDebug {
  static Codec = codec.Class(PreimageItem, {
    hash: codec.bytes(HASH_SIZE).asOpaque<PreimageHash>(),
    blob: codec.blob,
  });

  static create({ hash, blob }: CodecRecord<PreimageItem>) {
    return new PreimageItem(hash, blob);
  }

  private constructor(
    readonly hash: PreimageHash,
    readonly blob: BytesBlob,
  ) {
    super();
  }
}

export type StorageKey = Opaque<BytesBlob, "storage key">;

export class StorageItem extends WithDebug {
  static Codec = codec.Class(StorageItem, {
    key: codec.blob.convert(
      (i) => i,
      (o) => asOpaqueType(o),
    ),
    value: codec.blob,
  });

  static create({ key, value }: CodecRecord<StorageItem>) {
    return new StorageItem(key, value);
  }

  private constructor(
    readonly key: StorageKey,
    readonly value: BytesBlob,
  ) {
    super();
  }
}

const MAX_LOOKUP_HISTORY_SLOTS = 3;
export type LookupHistorySlots = KnownSizeArray<TimeSlot, `0-${typeof MAX_LOOKUP_HISTORY_SLOTS} timeslots`>;
export function tryAsLookupHistorySlots(items: readonly TimeSlot[]): LookupHistorySlots {
  const knownSize = asKnownSize(items) as LookupHistorySlots;
  if (knownSize.length > MAX_LOOKUP_HISTORY_SLOTS) {
    throw new Error(`Lookup history items must contain 0-${MAX_LOOKUP_HISTORY_SLOTS} timeslots.`);
  }
  return knownSize;
}

/** https://graypaper.fluffylabs.dev/#/5f542d7/115400115800 */
export class LookupHistoryItem {
  static new(hash: PreimageHash, length: U32, slots: LookupHistorySlots) {
    return new LookupHistoryItem(hash, length, slots);
  }

  private constructor(
    public readonly hash: PreimageHash,
    public readonly length: U32,
    /**
     * Preimage availability history as a sequence of time slots.
     * See PreimageStatus and the following GP fragment for more details.
     * https://graypaper.fluffylabs.dev/#/5f542d7/11780011a500 */
    public readonly slots: LookupHistorySlots,
  ) {}

  static isRequested(item: LookupHistoryItem | LookupHistorySlots): boolean {
    if ("slots" in item) {
      return item.slots.length === 0;
    }
    return item.length === 0;
  }
}
```
