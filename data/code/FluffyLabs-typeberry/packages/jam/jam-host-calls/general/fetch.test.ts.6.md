---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.test.ts#L540-L618
title: packages/jam/jam-host-calls/general/fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 6
chunk_total: 7
content_sha: d0c4c9ee6f31180c57a7fb7fae9098838c85ee8e7c441f06353994da39db1fe7
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.test.ts` (lines 540–618)

```typescript
    return this.workItemImportResponses.get(key) ?? null;
  }

  workPackage(): BytesBlob {
    return this.workPackageResponse;
  }

  authConfiguration(): BytesBlob {
    return this.authorizerResponse;
  }

  authToken(): BytesBlob {
    return this.authorizationTokenResponse;
  }

  refineContext(): BytesBlob {
    return this.refineContextResponse;
  }

  allWorkItems(): BytesBlob {
    return this.allWorkItemsResponse;
  }

  oneWorkItem(workItem: U64): BytesBlob | null {
    this.oneWorkItemData.push([workItem]);
    const key = workItem.toString();
    if (!this.oneWorkItemResponses.has(key)) {
      throw new Error(`Missing mock response for oneWorkItem(${key})`);
    }
    return this.oneWorkItemResponses.get(key) ?? null;
  }

  workItemPayload(workItem: U64): BytesBlob | null {
    this.workItemPayloadData.push([workItem]);
    const key = workItem.toString();
    if (!this.workItemPayloadResponses.has(key)) {
      throw new Error(`Missing mock response for workItemPayload(${key})`);
    }
    return this.workItemPayloadResponses.get(key) ?? null;
  }
}

class AccumulateFetchMock implements IAccumulateFetch {
  readonly context = FetchContext.Accumulate;

  public readonly oneTransferOrOperandData: Parameters<AccumulateFetchMock["oneTransferOrOperand"]>[] = [];

  public constantsResponse: BytesBlob | null = null;
  public entropyResponse: EntropyHash | null = null;
  public allTransfersAndOperandsResponse: BytesBlob | null = null;
  public oneTransferOrOperandResponses: Map<string, BytesBlob | null> = new Map();

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

  allTransfersAndOperands(): BytesBlob | null {
    return this.allTransfersAndOperandsResponse;
  }

  oneTransferOrOperand(index: U64): BytesBlob | null {
    this.oneTransferOrOperandData.push([index]);
    const key = index.toString();
    if (!this.oneTransferOrOperandResponses.has(key)) {
      throw new Error(`Missing mock response for oneTransferOrOperand(${key})`);
    }
    return this.oneTransferOrOperandResponses.get(key) ?? null;
  }
}
```
