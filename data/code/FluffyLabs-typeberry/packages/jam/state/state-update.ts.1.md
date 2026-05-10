---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/state-update.ts#L130-L232
title: packages/jam/state/state-update.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: 8c51327c09c9b86bf1f6c8c5a6ebef27916fd6f79d9bc61015731b36628f0e70
language: typescript
---
`packages/jam/state/state-update.ts` (lines 130–232)

```typescript
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
          kind: UpdateServiceKind.Update;
          account: ServiceAccountInfo;
        }
      | {
          kind: UpdateServiceKind.Create;
          account: ServiceAccountInfo;
          lookupHistory: LookupHistoryItem | null;
        },
  ) {}

  static update({ serviceInfo }: { serviceInfo: ServiceAccountInfo }) {
    return new UpdateService({
      kind: UpdateServiceKind.Update,
      account: serviceInfo,
    });
  }

  static create({
    serviceInfo,
    lookupHistory,
  }: {
    serviceInfo: ServiceAccountInfo;
    lookupHistory: LookupHistoryItem | null;
  }) {
    return new UpdateService({
      kind: UpdateServiceKind.Create,
      account: serviceInfo,
      lookupHistory,
    });
  }
}

/** Update service storage kind. */
export enum UpdateStorageKind {
  /** Set a storage value. */
  Set = 0,
  /** Remove a storage value. */
  Remove = 1,
}
/**
 * Update service storage item.
 *
 * Can either create/modify an entry or remove it.
 */
export class UpdateStorage {
  private constructor(
    public readonly action:
      | {
          kind: UpdateStorageKind.Set;
          storage: StorageItem;
        }
      | {
          kind: UpdateStorageKind.Remove;
          key: StorageKey;
        },
  ) {}

  static set({ storage }: { storage: StorageItem }) {
    return new UpdateStorage({ kind: UpdateStorageKind.Set, storage });
  }

  static remove({ key }: { key: StorageKey }) {
    return new UpdateStorage({ kind: UpdateStorageKind.Remove, key });
  }

  get key() {
    if (this.action.kind === UpdateStorageKind.Remove) {
      return this.action.key;
    }
    return this.action.storage.key;
  }

  get value(): BytesBlob | null {
    if (this.action.kind === UpdateStorageKind.Remove) {
      return null;
    }
    return this.action.storage.value;
  }
}

export type ServicesUpdate = {
  /** Service ids to remove from state alongside all their data. */
  removed: ServiceId[];
  /** Services newly created. */
  created: ServiceId[];
  /** Services to update. */
  updated: Map<ServiceId, UpdateService>;
  /** Service preimages to update and potentially lookup history */
  preimages: Map<ServiceId, UpdatePreimage[]>;
  /** Service storage to update. */
  storage: Map<ServiceId, UpdateStorage[]>;
};
```
