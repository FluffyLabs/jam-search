---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.test.ts#L87-L183
title: packages/jam/jam-host-calls/general/fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 7
content_sha: c36034f3384a18c97bffce65c9c8f1d18d95c0388b6271d7682d150fe57586a9
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.test.ts` (lines 87–183)

```typescript
    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), tryAsU64(blob.length));

    assert.deepStrictEqual(readBack(), Uint8Array.from([6, 5, 0, 0, 0]));
  });

  it("should return NONE and write nothing if fetch kind is unknown", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.empty();
    const fetchMock = new RefineFetchMock();
    fetchMock.constantsResponse = blob;

    const { registers, memory, readBack } = prepareRegsAndMemory(blob, FetchKind.Constants);
    registers.set(10, tryAsU64(999));

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.strictEqual(registers.get(IN_OUT_REG), HostCallResult.NONE);
    assert.deepStrictEqual(readBack(), new Uint8Array()); // memory should remain empty
  });

  it("should fetch constants and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([1, 2, 3, 4, 5]);
    const fetchMock = new RefineFetchMock();
    fetchMock.constantsResponse = blob;

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.Constants);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
  });

  it("should fetch entropy and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob: EntropyHash = Bytes.fill(HASH_SIZE, 10).asOpaque();
    const fetchMock = new RefineFetchMock();
    fetchMock.entropyResponse = blob;

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.Entropy);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
  });

  it("should fetch authorizer trace and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([9, 9, 9]);
    const fetchMock = new RefineFetchMock();
    fetchMock.authorizerTraceResponse = blob;

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.AuthorizerTrace);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
  });

  it("should fetch other work item extrinsics and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([42, 43, 44]);
    const fetchMock = new RefineFetchMock();
    const workItem = tryAsU64(123);
    const index = tryAsU64(7);
    const key = `${workItem}:${index}`;
    fetchMock.workItemExtrinsicResponses.set(key, blob);

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(
      blob,
      FetchKind.OtherWorkItemExtrinsics,
    );

    registers.set(11, workItem);
    registers.set(12, index);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
```
