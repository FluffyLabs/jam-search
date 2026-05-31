---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/test/calls.ts#L264-L290'
title: sdk/test/calls.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 43028a3959c5f3c68bacc781e3ebb01651ee4a0a654c024410e023b78429a80d
language: typescript
---
`sdk/test/calls.ts` (lines 264–290)

```typescript
    this._destination = v;
    return this;
  }

  withAmount(v: u64): TransferItem {
    this._amount = v;
    return this;
  }

  withMemo(blob: BytesBlob): TransferItem {
    this._memo = blob;
    return this;
  }

  withGas(v: u64): TransferItem {
    this._gas = v;
    return this;
  }

  /** Encode the transfer as an AccumulateItem blob (tag=1 + PendingTransfer). */
  build(): BytesBlob {
    const tx = PendingTransfer.create(this._source, this._destination, this._amount, this._memo, this._gas);
    const enc = Encoder.create();
    accumulateItemCodec().encode(AccumulateItem.fromTransfer(tx), enc);
    return enc.finish();
  }
}
```
