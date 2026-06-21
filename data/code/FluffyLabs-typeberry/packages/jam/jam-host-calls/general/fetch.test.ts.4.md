---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.test.ts#L354-L451
title: packages/jam/jam-host-calls/general/fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 4
chunk_total: 7
content_sha: 7d78c994a27185c9725121b5792fa3959dca341902a3c919117f9d03249505c2
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.test.ts` (lines 354–451)

```typescript
    const blob = BytesBlob.blobFromNumbers([60, 61, 62]);
    const fetchMock = new RefineFetchMock();
    const workItem = tryAsU64(77);
    fetchMock.workItemPayloadResponses.set(workItem.toString(), blob);

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.WorkItemPayload);

    registers.set(11, workItem);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
    assert.deepStrictEqual(fetchMock.workItemPayloadData, [[workItem]]);
  });

  it("should fetch all transfers and operands and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([101, 102, 103]);
    const fetchMock = new AccumulateFetchMock();
    fetchMock.allTransfersAndOperandsResponse = blob;

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(
      blob,
      FetchKind.AllTransfersAndOperands,
    );

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
  });

  it("should fetch one operand or transfer and write result to memory", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const blob = BytesBlob.blobFromNumbers([115, 116, 117]);
    const fetchMock = new AccumulateFetchMock();
    const index = tryAsU64(9);
    fetchMock.oneTransferOrOperandResponses.set(index.toString(), blob);

    const { registers, memory, readBack, expectedLength } = prepareRegsAndMemory(blob, FetchKind.OneTransferOrOperand);

    registers.set(11, index);

    const fetch = Fetch.new(currentServiceId, fetchMock);
    const result = await fetch.execute(gas, registers, memory);

    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(IN_OUT_REG), expectedLength);
    assert.deepStrictEqual(readBack(), blob.raw);
    assert.deepStrictEqual(fetchMock.oneTransferOrOperandData, [[index]]);
  });

  it("should return NONE for refine-only kinds in accumulate context", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const fetchMock = new AccumulateFetchMock();
    const blob = BytesBlob.empty();

    for (const kind of [
      FetchKind.AuthorizerTrace,
      FetchKind.OtherWorkItemExtrinsics,
      FetchKind.MyExtrinsics,
      FetchKind.OtherWorkItemImports,
      FetchKind.MyImports,
      FetchKind.WorkPackage,
      FetchKind.AuthConfiguration,
      FetchKind.AuthToken,
      FetchKind.RefineContext,
      FetchKind.AllWorkItems,
      FetchKind.OneWorkItem,
      FetchKind.WorkItemPayload,
    ]) {
      const { registers, memory } = prepareRegsAndMemory(blob, kind);

      const fetch = Fetch.new(currentServiceId, fetchMock);
      const result = await fetch.execute(gas, registers, memory);

      assert.strictEqual(result, undefined, `Expected undefined for kind ${kind}`);
      assert.strictEqual(registers.get(IN_OUT_REG), HostCallResult.NONE, `Expected NONE for kind ${kind}`);
    }
  });

  it("should return NONE for accumulate-only kinds in refine context", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const fetchMock = new RefineFetchMock();
    const blob = BytesBlob.empty();

    for (const kind of [FetchKind.AllTransfersAndOperands, FetchKind.OneTransferOrOperand]) {
      const { registers, memory } = prepareRegsAndMemory(blob, kind);

      const fetch = Fetch.new(currentServiceId, fetchMock);
      const result = await fetch.execute(gas, registers, memory);

      assert.strictEqual(result, undefined, `Expected undefined for kind ${kind}`);
```
