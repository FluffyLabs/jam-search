---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/pvm.ts#L101-L162
title: bin/test-runner/w3f/pvm.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a44319f7337d50afddeb58748ea4491cf5ef94c507a5feb3a47ee5ce099beaf4
language: typescript
---
`bin/test-runner/w3f/pvm.ts` (lines 101–162)

```typescript
    if (status === Status.PANIC) {
      return "panic";
    }

    if (status === Status.OOG) {
      return "oog";
    }

    if (status === Status.HOST) {
      return "host";
    }

    return "halt";
  };

  pvm.resetGeneric(testContent.program, testContent["initial-pc"], tryAsGas(testContent["initial-gas"]), regs, memory);
  pvm.runProgram();

  assert.strictEqual(pvm.gas.get(), BigInt(testContent["expected-gas"]));
  assert.strictEqual(pvm.getPC(), testContent["expected-pc"]);
  assert.deepStrictEqual(pvm.registers.getAllU64(), testContent["expected-regs"]);

  const testStatus = mapPvmStatus(pvm.getStatus());
  const exitParam = pvm.getExitParam();
  assert.strictEqual(testStatus, testContent["expected-status"]);
  assert.strictEqual(exitParam, testContent["expected-page-fault-address"] ?? null);

  const dirtyPages = memory.getDirtyPages();
  const checkedPages = new Set<PageNumber>();
  const expectedMemory = testContent["expected-memory"];

  const expectedMemoryByPageNumber = expectedMemory.reduce(
    (acc, memoryChunk) => {
      const memoryAddress = tryAsMemoryIndex(memoryChunk.address);
      const pageNumber = getPageNumber(memoryAddress);
      const chunksOnPage = acc[pageNumber] ?? [];
      chunksOnPage.push(memoryChunk);
      acc[pageNumber] = chunksOnPage;
      return acc;
    },
    {} as { [key: number]: MemoryChunkItem[] },
  );

  for (const [pageNumberAsString, memoryChunks] of Object.entries(expectedMemoryByPageNumber)) {
    const pageNumber = tryAsPageNumber(Number(pageNumberAsString));
    const expectedPage = safeAllocUint8Array(PAGE_SIZE);
    for (const memoryChunk of memoryChunks) {
      const pageIndex = memoryChunk.address % PAGE_SIZE;
      expectedPage.set(memoryChunk.contents, pageIndex);
    }
    checkedPages.add(pageNumber);
    assert.deepStrictEqual(pvm.getMemoryPage(pageNumber), expectedPage);
  }

  const pageThatShouldBeEmpty = Array.from(dirtyPages).filter((pageNumber) => !checkedPages.has(pageNumber));

  for (const pageNumber of pageThatShouldBeEmpty) {
    const memoryPage = pvm.getMemoryPage(pageNumber);
    const max = memoryPage !== null ? Math.max(...memoryPage) : 0;
    assert.deepStrictEqual(max, 0);
  }
}
```
