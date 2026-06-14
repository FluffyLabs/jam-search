---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/preimages.test.ts#L102-L206
title: packages/jam/transition/preimages.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 3
content_sha: d7be0bf4e65c2d78a854091ce0b8bac3faa6dbcfebb5667c2a658345cda970f6
language: typescript
---
`packages/jam/transition/preimages.test.ts` (lines 102–206)

```typescript
    const result = preimages.integrate(input);

    deepEqual(
      result,
      Result.error(PreimagesErrorCode.PreimagesNotSortedUnique, () => "Preimages not sorted/unique at index 1"),
    );
  });

  it("should reject duplicates", () => {
    const state = InMemoryState.partial(tinyChainSpec, {
      services: new Map([[tryAsServiceId(0), createAccount(tryAsServiceId(0))]]),
    });
    const preimages = new Preimages(state, blake2b);

    const blob = BytesBlob.parseBlob("0xdeadbeef11223344556677889900aabbccddeeff0123456789abcdef01234567");
    const input = createInput(
      [
        { requester: tryAsServiceId(0), blob },
        { requester: tryAsServiceId(0), blob },
      ],
      tryAsTimeSlot(12),
    );

    const result = preimages.integrate(input);

    deepEqual(
      result,
      Result.error(PreimagesErrorCode.PreimagesNotSortedUnique, () => "Preimages not sorted/unique at index 1"),
    );
  });

  it("should reject preimages when account not found", () => {
    const state = InMemoryState.partial(tinyChainSpec, {
      services: new Map([[tryAsServiceId(0), createAccount(tryAsServiceId(0))]]),
    });
    const preimages = new Preimages(state, blake2b);

    const blob = BytesBlob.parseBlob("0xc0ffee0011223344556677889900aabbccddeeff0123456789abcdef01234567");
    const input = createInput([{ requester: tryAsServiceId(1), blob }], tryAsTimeSlot(12));

    const result = preimages.integrate(input);

    deepEqual(
      result,
      Result.error(PreimagesErrorCode.AccountNotFound, () => "Service not found: 1"),
    );
  });

  it("should reject unrequested preimages", () => {
    const state = InMemoryState.partial(tinyChainSpec, {
      services: new Map([[tryAsServiceId(0), createAccount(tryAsServiceId(0))]]),
    });
    const preimages = new Preimages(state, blake2b);

    const blob = BytesBlob.parseBlob("0xbaddcafe11223344556677889900aabbccddeeff0123456789abcdef01234567");
    const input = createInput([{ requester: tryAsServiceId(0), blob }], tryAsTimeSlot(12));

    const result = preimages.integrate(input);

    deepEqual(
      result,
      Result.error(
        PreimagesErrorCode.PreimageUnneeded,
        () =>
          "Preimage unneeded: requester=0, hash=0xc3fc57df6dc7504b8d3763a68716b735224356f809930d31d84c7c1d3d3c5506, hasPreimage=false, isRequested=false",
      ),
    );
  });

  it("should reject already integrated preimages", () => {
    const blob = BytesBlob.parseBlob("0xcafebabe11223344556677889900aabbccddeeff0123456789abcdef01234567");
    const hash = blake2b.hashBytes(blob).asOpaque();

    const preimages = [PreimageItem.create({ hash, blob })];
    const lookupHistory = [
      LookupHistoryItem.new(hash, tryAsU32(blob.length), tryAsLookupHistorySlots([tryAsTimeSlot(5)])),
    ];

    const state = InMemoryState.partial(tinyChainSpec, {
      services: new Map([[tryAsServiceId(0), createAccount(tryAsServiceId(0), preimages, lookupHistory)]]),
    });
    const preimagesService = new Preimages(state, blake2b);

    const input = createInput([{ requester: tryAsServiceId(0), blob }], tryAsTimeSlot(12));

    const result = preimagesService.integrate(input);

    deepEqual(
      result,
      Result.error(
        PreimagesErrorCode.PreimageUnneeded,
        () =>
          "Preimage unneeded: requester=0, hash=0x3bb1eaa37b44192b79bd422264cbe973cf3ce4549c3b193ee39a7a8ebbf90a1f, hasPreimage=true, isRequested=false",
      ),
    );
  });

  it("should successfully integrate preimages", () => {
    const blob1 = BytesBlob.parseBlob("0x1337beef11223344556677889900aabbccddeeff0123456789abcdef01234567");
    const blob2 = BytesBlob.parseBlob("0x8badf00d11223344556677889900aabbccddeeff0123456789abcdef01234567");
    const hash1 = blake2b.hashBytes(blob1).asOpaque();
    const hash2 = blake2b.hashBytes(blob2).asOpaque();

    const lookupHistory = [
      LookupHistoryItem.new(hash1, tryAsU32(blob1.length), tryAsLookupHistorySlots([])),
```
