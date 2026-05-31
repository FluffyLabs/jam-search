---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/info.ts#L97-L130
title: packages/jam/jam-host-calls/general/info.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 348bac1cab8e221c025de62794d074beb97e64e16a5cdfa439c90367fc30fc0c
language: typescript
---
`packages/jam/jam-host-calls/general/info.ts` (lines 97–130)

```typescript
    logger.trace`[${this.currentServiceId}] INFO(${serviceId}, off: ${offset}, len: ${length}) <- ${BytesBlob.blobFrom(chunk)}`;

    if (accountInfo === null) {
      regs.set(IN_OUT_REG, HostCallResult.NONE);
      return;
    }

    regs.set(IN_OUT_REG, valueLength);
  }
}

/**
 * Service account details with threshold balance.
 *
 * Used exclusively by `info` host call.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/33920033b500?v=0.7.2
 */
export const codecServiceAccountInfoWithThresholdBalance = codec.object(
  {
    codeHash: codec.bytes(HASH_SIZE),
    balance: codec.u64,
    thresholdBalance: codec.u64,
    accumulateMinGas: codec.u64.convert((i) => i, tryAsServiceGas),
    onTransferMinGas: codec.u64.convert((i) => i, tryAsServiceGas),
    storageUtilisationBytes: codec.u64,
    storageUtilisationCount: codec.u32,
    gratisStorage: codec.u64,
    created: codec.u32.convert((x) => x, tryAsTimeSlot),
    lastAccumulation: codec.u32.convert((x) => x, tryAsTimeSlot),
    parentService: codec.u32.convert((x) => x, tryAsServiceId),
  },
  "ServiceAccountInfoWithThresholdBalance",
);
```
