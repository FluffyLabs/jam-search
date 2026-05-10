---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/item.ts#L119-L230
title: sdk/jam/accumulate/item.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 4be1df19bd72e71043ed5cc949e1ab5da242f7d9a664cc9099eab523338d424c
language: typescript
---
`sdk/jam/accumulate/item.ts` (lines 119–230)

```typescript
    /** Gas allocated for accumulation. */
    public gas: u64,
    /** Refine execution result. */
    public result: WorkExecResult,
    /** Authorization output data. */
    public authorizationOutput: BytesBlob,
  ) {}
}

export class OperandCodec implements TryDecode<Operand>, TryEncode<Operand> {
  static create(workExecResult: WorkExecResultCodec): OperandCodec {
    return new OperandCodec(workExecResult);
  }
  private constructor(private readonly workExecResult: WorkExecResultCodec) {}

  decode(d: Decoder): Result<Operand, DecodeError> {
    const hash = d.bytes32();
    const exportsRoot = d.bytes32();
    const authorizerHash = d.bytes32();
    const payloadHash = d.bytes32();
    const gas = d.varU64();
    if (d.isError) return Result.err<Operand, DecodeError>(DecodeError.MissingBytes);
    const r = d.object<WorkExecResult>(this.workExecResult);
    if (r.isError) return Result.err<Operand, DecodeError>(r.error);
    const authorizationOutput = d.bytesVarLen();
    if (d.isError) return Result.err<Operand, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<Operand, DecodeError>(
      Operand.create(hash, exportsRoot, authorizerHash, payloadHash, gas, r.okay!, authorizationOutput),
    );
  }

  encode(v: Operand, e: Encoder): void {
    e.bytesFixLen(v.hash.bytes);
    e.bytesFixLen(v.exportsRoot.bytes);
    e.bytesFixLen(v.authorizerHash.bytes);
    e.bytesFixLen(v.payloadHash.bytes);
    e.varU64(v.gas);
    e.object<WorkExecResult>(this.workExecResult, v.result);
    e.bytesVarLen(v.authorizationOutput);
  }
}

// ─── PendingTransfer ──────────────────────────────────────────────────

/** Size of the transfer memo field in bytes (W_T in the Gray Paper). */
export const TRANSFER_MEMO_SIZE: u32 = 128;

/**
 * Pending transfer from another service.
 *
 * Encoding order matches the Gray Paper / typeberry codec:
 *   source(u32 LE) + destination(u32 LE) + amount(u64 LE)
 *   + memo(128 bytes) + gas(u64 LE)
 */
export class PendingTransfer {
  static create(source: u32, destination: u32, amount: u64, memo: BytesBlob, gas: u64): PendingTransfer {
    assert(<u32>memo.raw.length <= TRANSFER_MEMO_SIZE, `memo too large: ${memo.raw.length} > ${TRANSFER_MEMO_SIZE}`);
    return new PendingTransfer(source, destination, amount, memo, gas);
  }

  private constructor(
    /** Sending service ID. */
    public source: u32,
    /** Receiving service ID. */
    public destination: u32,
    /** Transfer amount. */
    public amount: u64,
    /** 128-byte memo. */
    public memo: BytesBlob,
    /** Gas allowance for the transfer. */
    public gas: u64,
  ) {}
}

export class PendingTransferCodec implements TryDecode<PendingTransfer>, TryEncode<PendingTransfer> {
  static create(): PendingTransferCodec {
    return new PendingTransferCodec();
  }
  private constructor() {}

  decode(d: Decoder): Result<PendingTransfer, DecodeError> {
    const source = d.u32();
    const destination = d.u32();
    const amount = d.u64();
    const memo = d.bytesFixLen(TRANSFER_MEMO_SIZE);
    const gas = d.u64();
    if (d.isError) return Result.err<PendingTransfer, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<PendingTransfer, DecodeError>(PendingTransfer.create(source, destination, amount, memo, gas));
  }

  encode(v: PendingTransfer, e: Encoder): void {
    e.u32(v.source);
    e.u32(v.destination);
    e.u64(v.amount);
    // Memo is guaranteed <= TRANSFER_MEMO_SIZE by PendingTransfer.create; pad if shorter.
    if (<u32>v.memo.length === TRANSFER_MEMO_SIZE) {
      e.bytesFixLen(v.memo);
    } else {
      const padded = new Uint8Array(TRANSFER_MEMO_SIZE);
      padded.set(v.memo.raw);
      e.bytesFixLen(BytesBlob.wrap(padded));
    }
    e.u64(v.gas);
  }
}

// ─── AccumulateItem ───────────────────────────────────────────────────

/**
 * Discriminated union of accumulate items (operand or transfer).
 *
 * Use `isOperand` / `isTransfer` to check the kind, then access the
```
