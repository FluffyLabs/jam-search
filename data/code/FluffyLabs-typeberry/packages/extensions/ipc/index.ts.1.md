---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/extensions/ipc/index.ts#L121-L151
title: packages/extensions/ipc/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 2eb3f95b2e12e983816426e66ba6859bdd6ede8c0dd70ba7594d108aaeb9a5a0
language: typescript
---
`packages/extensions/ipc/index.ts` (lines 121–151)

```typescript
    const entries = StateEntries.fromEntriesUnsafe(keyvals.map(({ key, value }) => [key.asOpaque(), value]));
    const root = this.api.resetState(
      header,
      entries,
      ancestry.map((x) => [x.headerHash, x.slot]),
    );
    return root;
  }

  async importBlock(value: BlockView): Promise<Result<StateRootHash, v1.ErrorMessage>> {
    const res = await this.api.importBlock(value);
    if (res.isOk) {
      return res;
    }
    logger.log`Rejecting block with error: ${res.error}. ${res.details()}`;
    return Result.error(v1.ErrorMessage.create({ message: res.error }), res.details);
  }

  async getPeerInfo(value: v1.PeerInfo): Promise<v1.PeerInfo> {
    logger.info`Fuzzer ${value} connected.`;

    return v1.PeerInfo.create({
      name: this.api.nodeName,
      appVersion: this.api.nodeVersion,
      jamVersion: this.api.gpVersion,
      fuzzVersion: value.fuzzVersion,
      // Safe to convert: Features are small enum values that fit in U32 range
      features: tryAsU32(v1.Features.Ancestry | v1.Features.Fork),
    });
  }
}
```
