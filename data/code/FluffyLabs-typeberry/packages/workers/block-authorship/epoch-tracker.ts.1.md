---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/epoch-tracker.ts#L87-L106
title: packages/workers/block-authorship/epoch-tracker.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 285226dd1c2fac4b0d77052d165fa8df8ce44279c8cd5f0ba1a3ca407eb4c105
language: typescript
---
`packages/workers/block-authorship/epoch-tracker.ts` (lines 87–106)

```typescript
      punishSet: state.disputesRecords.punishSet,
    });
  }

  private logEpochAuthorshipInfo(logger: Logger, epoch: Epoch, slots: Array<SlotSealData | null>) {
    let isCreating = false;
    let slot = epoch * this.chainSpec.epochLength;
    for (const sealData of slots) {
      if (sealData !== null) {
        isCreating = true;
        logger.info`[E${epoch}#${slot}] Validator ${sealData.key.bandersnatchPublic.toStringTruncated()} will author using ${sealData.logId}`;
      }
      slot += 1;
    }

    if (isCreating === false) {
      logger.info`[E${epoch}] No blocks to author for this epoch.`;
    }
  }
}
```
