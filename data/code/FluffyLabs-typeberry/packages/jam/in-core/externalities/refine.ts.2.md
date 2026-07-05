---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine.ts#L217-L239
title: packages/jam/in-core/externalities/refine.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 2fbb436976c57580076b31632c945a0dd2c0315a9d79ccd58a209b840dfffb53
language: typescript
---
`packages/jam/in-core/externalities/refine.ts` (lines 217–239)

```typescript
      return Result.error(
        SegmentExportError,
        () =>
          `Maximum number of exported segments exceeded (offset: ${this.exportOffset}, exported: ${this.exportedSegments.length})`,
      );
    }
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/337303337303?v=0.7.2
    this.exportedSegments.push(segment);
    return Result.ok(tryAsSegmentIndex(currentIndex));
  }

  historicalLookup(serviceId: ServiceId | null, hash: Blake2bHash): Promise<BytesBlob | null> {
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/33d70133f901?v=0.7.2
    const sid = serviceId ?? this.currentServiceId;
    const service = this.lookupState.getService(sid);
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/334802334802?v=0.7.2
    if (service === null) {
      return Promise.resolve(null);
    }
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/334f02334f02?v=0.7.2
    return Promise.resolve(service.getPreimage(hash.asOpaque()));
  }
}
```
