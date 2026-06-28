---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/is-authorized.test.ts#L173-L205
title: packages/jam/in-core/is-authorized.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 2
chunk_total: 3
content_sha: e652006eb6a707638f72367bcdebdd41a4d18ce7826d531c680a2f866f150a66
language: typescript
---
`packages/jam/in-core/is-authorized.test.ts` (lines 173–205)

```typescript
  it("should fail when auth code preimage is missing", async () => {
    const authCodeHash = getAuthCodeHash();
    // Service exists but with no preimages
    const emptyService = InMemoryService.new(AUTH_SERVICE_ID, {
      info: ServiceAccountInfo.create({
        codeHash: Bytes.zero(HASH_SIZE).asOpaque<CodeHash>(),
        balance: tryAsU64(0),
        accumulateMinGas: tryAsServiceGas(0n),
        onTransferMinGas: tryAsServiceGas(0n),
        storageUtilisationBytes: tryAsU64(0),
        storageUtilisationCount: tryAsU32(0),
        gratisStorage: tryAsU64(0),
        created: tryAsTimeSlot(0),
        lastAccumulation: tryAsTimeSlot(0),
        parentService: tryAsServiceId(0),
      }),
      preimages: HashDictionary.fromEntries([]),
      lookupHistory: HashDictionary.fromEntries([]),
      storage: new Map(),
    });
    const state = InMemoryState.partial(spec, {
      timeslot: tryAsTimeSlot(16),
      services: new Map([[AUTH_SERVICE_ID, emptyService]]),
    });
    const isAuthorized = new IsAuthorized(spec, PvmBackend.BuiltIn, blake2b);

    const emptyPreimage = buildPackageAndFetchData(authCodeHash, BytesBlob.empty(), BytesBlob.empty());
    const result = await isAuthorized.invoke(state, tryAsCoreIndex(0), emptyPreimage.fetchData);

    assert.strictEqual(result.isError, true);
    assert.strictEqual(result.error, AuthorizationError.CodeNotFound);
  });
});
```
