---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L277-L290
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 3
chunk_total: 4
content_sha: 32f28b0c64a3de530e983db6706063f89e145621b6ba8254727d75319a3ed675
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 277–290)

```typescript
    const waitMs = elapsedInSlot === 0n ? this.slotDurationMs : this.slotDurationMs - elapsedInSlot;
    await setTimeout(Number(waitMs));
  }

  /**
   * We assume there is no gap between system time and the initial state time.
   *
   * I.e. we can resume any database by moving the state time to the future.
   */
  private getVirtualTimeMs() {
    const timeFromStart = systemTimeMs() - this.systemStartTimeMs;
    return tryAsU64(this.stateStartTime + timeFromStart + this.slotDurationMs);
  }
}
```
