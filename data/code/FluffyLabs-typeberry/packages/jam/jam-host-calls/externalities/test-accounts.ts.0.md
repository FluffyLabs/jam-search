---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/test-accounts.ts#L1-L81
title: packages/jam/jam-host-calls/externalities/test-accounts.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6989733c2c95e153ec5381dd8986a36c4e5e9b10c63d9801b1ae813c3af0bb23
language: typescript
---
`packages/jam/jam-host-calls/externalities/test-accounts.ts` (lines 1–81)

```typescript
import type { ServiceId } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import { MultiMap } from "@typeberry/collections";
import type { Blake2bHash } from "@typeberry/hash";
import { ServiceAccountInfo, type StorageKey } from "@typeberry/state";
import { Result } from "@typeberry/utils";
import type { AccountsInfo } from "../general/info.js";
import type { AccountsLookup } from "../general/lookup.js";
import type { AccountsRead } from "../general/read.js";
import type { AccountsWrite } from "../general/write.js";

export class TestAccounts implements AccountsLookup, AccountsRead, AccountsWrite, AccountsInfo {
  constructor(private readonly serviceId: ServiceId) {}
  public readonly preimages: MultiMap<[ServiceId, Blake2bHash], BytesBlob | null> = MultiMap.new(2, [
    null,
    (hash) => hash.toString(),
  ]);
  public readonly storage: MultiMap<[ServiceId, StorageKey], BytesBlob | null> = MultiMap.new(2, [
    null,
    (hash) => hash.toString(),
  ]);
  public readonly details = new Map<ServiceId, ServiceAccountInfo>();

  lookup(serviceId: ServiceId | null, hash: Blake2bHash): BytesBlob | null {
    if (serviceId === null) {
      return null;
    }
    const preImage = this.preimages.get(serviceId, hash);
    if (preImage === undefined) {
      return null;
    }
    return preImage;
  }

  read(serviceId: ServiceId | null, hash: StorageKey): BytesBlob | null {
    if (serviceId === null) {
      return null;
    }
    const d = this.storage.get(serviceId, hash);
    if (d === undefined) {
      return null;
    }
    return d;
  }

  write(hash: StorageKey, data: BytesBlob | null): Result<number | null, "full"> {
    if (this.isStorageFull()) {
      return Result.error("full", () => "Test accounts: storage is full");
    }

    const prev = this.storage.get(this.serviceId, hash);
    if (data === null) {
      this.storage.delete(this.serviceId, hash);
    } else {
      this.storage.set(data, this.serviceId, hash);
    }

    return Result.ok(prev?.length ?? null);
  }

  private isStorageFull(): boolean {
    const accountInfo = this.details.get(this.serviceId);
    if (accountInfo === undefined) {
      return false;
    }
    return (
      ServiceAccountInfo.calculateThresholdBalance(
        accountInfo.storageUtilisationCount,
        accountInfo.storageUtilisationBytes,
        accountInfo.gratisStorage,
      ) > accountInfo.balance
    );
  }

  getServiceInfo(serviceId: ServiceId | null): ServiceAccountInfo | null {
    if (serviceId === null) {
      return null;
    }
    return this.details.get(serviceId) ?? null;
  }
}
```
