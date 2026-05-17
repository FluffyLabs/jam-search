---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.test.ts#L179-L271
title: packages/jam/jam-host-calls/general/fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 7
content_sha: 2ca3eef1b37d2efb02ab57f7358bfc5f8ecf76ae74a9a0cbe72d36f06cd7fa71
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.test.ts` (lines 179–271)

```typescript
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
    assert.deepStrictEqual(fetchMock.workItemExtrinsicData, [[workItem, index]]);
  });

  it("should fetch my extrinsics and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([11, 12, 13]);
    const fetchMock = new RefineFetchMock();
    const index = tryAsU64(5);
    const key = `null:${index}`;
    fetchMock.workItemExtrinsicResponses.set(key, blob);

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.MyExtrinsics);

    registers.set(11, index); // only index; workItem is null

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
    assert.deepStrictEqual(fetchMock.workItemExtrinsicData, [[null, index]]);
  });

  it("should fetch other work item imports and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([21, 22, 23]);
    const fetchMock = new RefineFetchMock();
    const workItem = tryAsU64(42);
    const index = tryAsU64(3);
    const key = `${workItem}:${index}`;
    fetchMock.workItemImportResponses.set(key, blob);

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.OtherWorkItemImports);

    registers.set(11, workItem);
    registers.set(12, index);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
    assert.deepStrictEqual(fetchMock.workItemImportData, [[workItem, index]]);
  });

  it("should fetch my imports and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([31, 32, 33]);
    const fetchMock = new RefineFetchMock();
    const index = tryAsU64(8);
    const key = `null:${index}`;
    fetchMock.workItemImportResponses.set(key, blob);

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.MyImports);

    registers.set(11, index); // workItem is implicitly null

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
    assert.deepStrictEqual(fetchMock.workItemImportData, [[null, index]]);
  });

  it("should fetch work package and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([100, 101, 102]);
    const fetchMock = new RefineFetchMock();
    fetchMock.workPackageResponse = blob;

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.WorkPackage);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
  });

  it("should fetch authorizer and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([201, 202, 203]);
    const fetchMock = new RefineFetchMock();
```
