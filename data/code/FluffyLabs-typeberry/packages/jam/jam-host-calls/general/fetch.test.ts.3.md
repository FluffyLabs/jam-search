---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.test.ts#L268-L358
title: packages/jam/jam-host-calls/general/fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 3
chunk_total: 7
content_sha: 1734ef40674314e981c124456edd24313c04b38286b08817da0a5f7f1b9fed95
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.test.ts` (lines 268–358)

```typescript
  it("should fetch authorizer and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([201, 202, 203]);
    const fetchMock = new RefineFetchMock();
    fetchMock.authorizerResponse = blob;

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.AuthConfiguration);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
  });

  it("should fetch authorization token and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([210, 211, 212]);
    const fetchMock = new RefineFetchMock();
    fetchMock.authorizationTokenResponse = blob;

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.AuthToken);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
  });

  it("should fetch refine context and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([88, 89, 90]);
    const fetchMock = new RefineFetchMock();
    fetchMock.refineContextResponse = blob;

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.RefineContext);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
  });

  it("should fetch all work items and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([70, 71, 72]);
    const fetchMock = new RefineFetchMock();
    fetchMock.allWorkItemsResponse = blob;

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.AllWorkItems);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
  });

  it("should fetch one work item and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([33, 34, 35]);
    const fetchMock = new RefineFetchMock();
    const workItem = tryAsU64(55);
    fetchMock.oneWorkItemResponses.set(workItem.toString(), blob);

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.OneWorkItem);

    registers.set(11, workItem);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
    assert.deepStrictEqual(fetchMock.oneWorkItemData, [[workItem]]);
  });

  it("should fetch work item payload and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([60, 61, 62]);
    const fetchMock = new RefineFetchMock();
    const workItem = tryAsU64(77);
    fetchMock.workItemPayloadResponses.set(workItem.toString(), blob);

```
