---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.test.ts#L448-L551
title: packages/jam/jam-host-calls/general/fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 5
chunk_total: 7
content_sha: 8b19eafc2fa64a16463d8054eacde9e63e46cc1b93c7d87c0223e37bd72892e7
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.test.ts` (lines 448–551)

```typescript
      const fetch = Fetch.new(currentServiceId, fetchMock);
      const result = await fetch.execute(gas, registers, memory);

      assert.strictEqual(result, undefined, `Expected undefined for kind ${kind}`);
      assert.strictEqual(registers.get(IN_OUT_REG), HostCallResult.NONE, `Expected NONE for kind ${kind}`);
    }
  });

  function prepareRegsAndMemory(blob: BytesBlob, fetchKind: FetchKind, offset = 0, length: number = blob.length) {
    const pageStart = 2 ** 16;
    const memOffset = tryAsU64(pageStart + 1234);
    const blobLength = tryAsU64(blob.length);

    const registers = HostCallRegisters.empty();
    registers.set(IN_OUT_REG, memOffset);
    registers.set(8, tryAsU64(offset));
    registers.set(9, tryAsU64(length));
    registers.set(10, tryAsU64(fetchKind));

    const builder = new MemoryBuilder();
    builder.setWriteablePages(tryAsMemoryIndex(pageStart), tryAsMemoryIndex(pageStart + PAGE_SIZE));
    const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));

    const readBack = () => {
      const result = new Uint8Array(blob.length);
      assert.strictEqual(memory.loadInto(result, memOffset).isOk, true);
      return result;
    };

    return {
      registers,
      memory,
      readBack,
      expectedLength: blobLength,
    };
  }
});

class RefineFetchMock implements IRefineFetch {
  readonly context = FetchContext.Refine;

  public readonly workItemExtrinsicData: Parameters<RefineFetchMock["workItemExtrinsic"]>[] = [];
  public readonly workItemImportData: Parameters<RefineFetchMock["workItemImport"]>[] = [];
  public readonly oneWorkItemData: Parameters<RefineFetchMock["oneWorkItem"]>[] = [];
  public readonly workItemPayloadData: Parameters<RefineFetchMock["workItemPayload"]>[] = [];

  public constantsResponse: BytesBlob | null = null;
  public entropyResponse: EntropyHash | null = null;
  public authorizerTraceResponse: BytesBlob = BytesBlob.empty();
  public workItemExtrinsicResponses: Map<string, BytesBlob | null> = new Map();
  public workItemImportResponses: Map<string, BytesBlob | null> = new Map();
  public workPackageResponse: BytesBlob = BytesBlob.empty();
  public authorizerResponse: BytesBlob = BytesBlob.empty();
  public authorizationTokenResponse: BytesBlob = BytesBlob.empty();
  public refineContextResponse: BytesBlob = BytesBlob.empty();
  public allWorkItemsResponse: BytesBlob = BytesBlob.empty();
  public oneWorkItemResponses: Map<string, BytesBlob | null> = new Map();
  public workItemPayloadResponses: Map<string, BytesBlob | null> = new Map();

  constants(): BytesBlob {
    if (this.constantsResponse === null) {
      throw new Error("Unexpected call to constants.");
    }
    return this.constantsResponse;
  }

  entropy(): EntropyHash {
    if (this.entropyResponse === null) {
      throw new Error("Unexpected call to entropy.");
    }
    return this.entropyResponse;
  }

  authorizerTrace(): BytesBlob {
    return this.authorizerTraceResponse;
  }

  workItemExtrinsic(workItem: U64 | null, index: U64): BytesBlob | null {
    this.workItemExtrinsicData.push([workItem, index]);
    const key = `${workItem?.toString() ?? "null"}:${index.toString()}`;
    if (!this.workItemExtrinsicResponses.has(key)) {
      throw new Error(`Missing mock response for workItemExtrinsic(${key})`);
    }
    return this.workItemExtrinsicResponses.get(key) ?? null;
  }

  workItemImport(workItem: U64 | null, index: U64): BytesBlob | null {
    this.workItemImportData.push([workItem, index]);
    const key = `${workItem?.toString() ?? "null"}:${index.toString()}`;
    if (!this.workItemImportResponses.has(key)) {
      throw new Error(`Missing mock response for workItemImport(${key})`);
    }
    return this.workItemImportResponses.get(key) ?? null;
  }

  workPackage(): BytesBlob {
    return this.workPackageResponse;
  }

  authConfiguration(): BytesBlob {
    return this.authorizerResponse;
  }

  authToken(): BytesBlob {
```
