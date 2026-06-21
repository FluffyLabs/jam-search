---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/context.ts#L101-L191
title: sdk/jam/accumulate/context.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 3b107e8832d5bd3892d045194227c4a2acad82a62eaad06658861a03829ed066
language: typescript
---
`sdk/jam/accumulate/context.ts` (lines 101–191)

```typescript
  fetcher(bufSize: u32 = 1024): AccumulateFetcher {
    return AccumulateFetcher.create(bufSize);
  }

  /** Create an AccumulatePreimages helper (lookup + query/solicit/forget/provide). */
  preimages(bufSize: u32 = 1024): AccumulatePreimages {
    return AccumulatePreimages.create(bufSize);
  }

  /** Create a CurrentServiceData helper for storage read/write and account info. */
  serviceData(bufSize: u32 = 1024): CurrentServiceData {
    return CurrentServiceData.create(bufSize);
  }

  /** Create an Admin helper for privileged governance (bless, assign, designate). */
  admin(): Admin {
    return Admin.create();
  }

  /** Create a ChildServices helper for child service lifecycle (newChild, ejectChild). */
  childServices(): ChildServices {
    return ChildServices.create();
  }

  /** Create a SelfService helper for self-management (upgradeCode, requestEjection). */
  selfService(): SelfService {
    return SelfService.create();
  }

  /**
   * Create a state checkpoint, committing all changes up to this point (ecalli 17).
   *
   * @returns remaining gas after the checkpoint.
   */
  checkpoint(): i64 {
    return checkpoint_();
  }

  /**
   * Provide the accumulation result hash (ecalli 25).
   */
  yieldResult(hash: Bytes32): void {
    yield_result(hash.ptr());
  }

  /**
   * Schedule a balance transfer to another service (ecalli 20).
   *
   * The transfer is not instant — it is executed after accumulation completes.
   *
   * @param dest - destination service ID
   * @param amount - transfer amount
   * @param gasFee - gas fee limit for the transfer
   * @param memo - optional 128-byte memo (default: all zeros)
   * @returns ok(true) on success, or TransferError
   */
  scheduleTransfer(dest: ServiceId, amount: u64, gasFee: u64, memo: Memo | null = null): ResultN<bool, TransferError> {
    const m = memo !== null ? memo : Memo.empty();
    const result = transfer_(dest, amount, gasFee, m.ptr());
    if (result === EcalliResult.WHO) return ResultN.err<bool, TransferError>(TransferError.Who);
    if (result === EcalliResult.LOW) return ResultN.err<bool, TransferError>(TransferError.Low);
    if (result === EcalliResult.CASH) return ResultN.err<bool, TransferError>(TransferError.Cash);
    if (result >= 0) return ResultN.ok<bool, TransferError>(true);
    panic("AccumulateContext.scheduleTransfer: unexpected sentinel");
    return unreachable();
  }

  /** Parse raw accumulate arguments from (ptr, len). Panics on invalid data. */
  parseArgs(ptr: u32, len: u32): AccumulateArgs {
    const decoder = Decoder.fromBlob(readFromMemory(ptr, len));
    const r = this.accumulateArgs.decode(decoder);
    if (r.isError) panic("Failed to decode AccumulateArgs");
    if (!decoder.isFinished()) panic("Trailing bytes after AccumulateArgs");
    return r.okay!;
  }

  /** Encode a response and return it as a ptrAndLen-packed u64. */
  respond(ecalliResult: i64, data: Uint8Array | null = null): u64 {
    const bytes = data === null ? BytesBlob.empty() : BytesBlob.wrap(data);
    const enc = Encoder.create(8 + 1 + bytes.raw.length);
    this.response.encode(Response.create(ecalliResult, bytes), enc);
    return ptrAndLen(enc.finishRaw());
  }

  /** Encode an optional CodeHash and return it as a ptrAndLen-packed u64. */
  yieldHash(hash: Bytes32 | null): u64 {
    const enc = Encoder.create(33);
    this.optionalCodeHash.encode(hash, enc);
    return ptrAndLen(enc.finishRaw());
  }
}
```
