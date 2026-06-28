---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/preimages.ts#L147-L220
title: bin/test-runner/w3f/preimages.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 6b62b2e8b5e8d56007a632b59a24f3cc6a60ee74b269f0d201fcd1ef6909e411
language: typescript
---
`bin/test-runner/w3f/preimages.ts` (lines 147–220)

```typescript
}

export async function runPreImagesTest(testContent: PreImagesTest) {
  const blake2b = await Blake2b.createHasher();
  const preState = InMemoryState.partial(tinyChainSpec, {
    services: new Map(
      testContent.pre_state.accounts.map((account) => [
        tryAsServiceId(account.id),
        testAccountsMapEntryToAccount(account, blake2b),
      ]),
    ),
  });
  const postState = InMemoryState.partial(tinyChainSpec, {
    services: new Map(
      testContent.post_state.accounts.map((account) => [
        tryAsServiceId(account.id),
        testAccountsMapEntryToAccount(account, blake2b),
      ]),
    ),
  });
  const preimages = new Preimages(preState, blake2b);
  const result = preimages.integrate(testContent.input);

  deepEqual(result, testOutputToResult(testContent.output), { ignore: ["ok", "details"] });
  if (result.isOk) {
    preState.applyUpdate(result.ok);
  }
  deepEqual(preState, postState);
}

function testAccountsMapEntryToAccount(entry: TestAccountsMapEntry, blake2b: Blake2b): InMemoryService {
  const preimages = HashDictionary.fromEntries(
    entry.data.preimage_blobs
      .map((x) => {
        return PreimageItem.create({ hash: blake2b.hashBytes(x.blob).asOpaque(), blob: x.blob });
      })
      .map((x) => [x.hash, x]),
  );

  const lookupHistory = HashDictionary.new<PreimageHash, LookupHistoryItem[]>();
  for (const item of entry.data.preimage_requests) {
    const slots = tryAsLookupHistorySlots(item.value.map((slot) => tryAsTimeSlot(slot)));

    const arr = lookupHistory.get(item.key.hash) ?? [];
    arr.push(LookupHistoryItem.new(item.key.hash, tryAsU32(item.key.length), slots));
    lookupHistory.set(item.key.hash, arr);
  }

  return InMemoryService.new(tryAsServiceId(entry.id), {
    info: ServiceAccountInfo.create({
      codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
      balance: tryAsU64(0),
      accumulateMinGas: tryAsServiceGas(0),
      onTransferMinGas: tryAsServiceGas(0),
      storageUtilisationBytes: tryAsU64(0),
      gratisStorage: tryAsU64(0),
      storageUtilisationCount: tryAsU32(0),
      created: tryAsTimeSlot(0),
      lastAccumulation: tryAsTimeSlot(0),
      parentService: tryAsServiceId(0),
    }),
    storage: new Map(),
    preimages,
    lookupHistory,
  });
}

function testOutputToResult(testOutput: Output): ReturnType<Preimages["integrate"]> {
  return testOutput.err !== undefined
    ? Result.error(testOutput.err, () => `Preimages integration failed: ${testOutput.err}`)
    : Result.ok({
        preimages: new Map(),
      });
}
```
