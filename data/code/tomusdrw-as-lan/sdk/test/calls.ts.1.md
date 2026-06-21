---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/test/calls.ts#L123-L277'
title: sdk/test/calls.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 8e46a7962b11ccbd6d846abe68e95ed8ce39cb8f8fea923366d718ca875490d9
language: typescript
---
`sdk/test/calls.ts` (lines 123–277)

```typescript
  private _serviceId: ServiceId = DEFAULT_SERVICE_ID;

  private constructor() {}

  withSlot(v: Slot): AccumulateCall {
    this._slot = v;
    return this;
  }

  withServiceId(v: ServiceId): AccumulateCall {
    this._serviceId = v;
    return this;
  }

  /**
   * Encode AccumulateArgs (with the given `argsLength`), invoke
   * `accumulateFn`, and return the raw response bytes.
   */
  call(accumulateFn: (ptr: u32, len: u32) => u64, argsLength: u32): BytesBlob {
    const args = AccumulateArgs.create(this._slot, this._serviceId, argsLength);
    const enc = Encoder.create();
    AccumulateArgsCodec.create().encode(args, enc);
    const buf = enc.finish();
    return BytesBlob.wrap(unpackResult(accumulateFn(buf.ptr(), buf.length)));
  }
}

const DEFAULT_OPERAND_GAS: u64 = 100000;

/**
 * Builder for an encoded `AccumulateItem::Operand` blob, suitable for
 * `TestAccumulate.setItem(i, ...)`.
 *
 * Defaults: all four 32-byte hashes zeros, gas=100000, result=Ok with empty
 * okBlob, authorizationOutput=empty.
 */
export class OperandItem {
  static create(): OperandItem {
    return new OperandItem();
  }

  private _hash: Bytes32 = Bytes32.zero();
  private _exportsRoot: Bytes32 = Bytes32.zero();
  private _authorizerHash: Bytes32 = Bytes32.zero();
  private _payloadHash: Bytes32 = Bytes32.zero();
  private _gas: u64 = DEFAULT_OPERAND_GAS;
  private _resultKind: WorkExecResultKind = WorkExecResultKind.Ok;
  private _okBlob: BytesBlob = BytesBlob.empty();
  private _authorizationOutput: BytesBlob = BytesBlob.empty();

  private constructor() {}

  withHash(h: Bytes32): OperandItem {
    this._hash = h;
    return this;
  }

  withExportsRoot(h: Bytes32): OperandItem {
    this._exportsRoot = h;
    return this;
  }

  withAuthorizerHash(h: Bytes32): OperandItem {
    this._authorizerHash = h;
    return this;
  }

  withPayloadHash(h: Bytes32): OperandItem {
    this._payloadHash = h;
    return this;
  }

  withGas(v: u64): OperandItem {
    this._gas = v;
    return this;
  }

  /** Set the operand result to `Ok(blob)`. */
  withOkBlob(blob: BytesBlob): OperandItem {
    this._resultKind = WorkExecResultKind.Ok;
    this._okBlob = blob;
    return this;
  }

  /** Set the operand result kind (e.g. Panic, OutOfGas). Clears any okBlob. */
  withResultKind(kind: WorkExecResultKind): OperandItem {
    this._resultKind = kind;
    if (kind !== WorkExecResultKind.Ok) this._okBlob = BytesBlob.empty();
    return this;
  }

  withAuthorizationOutput(blob: BytesBlob): OperandItem {
    this._authorizationOutput = blob;
    return this;
  }

  /** Encode the operand as an AccumulateItem blob (tag=0 + Operand). */
  build(): BytesBlob {
    const op = Operand.create(
      this._hash,
      this._exportsRoot,
      this._authorizerHash,
      this._payloadHash,
      this._gas,
      WorkExecResult.create(this._resultKind, this._okBlob),
      this._authorizationOutput,
    );
    const enc = Encoder.create();
    accumulateItemCodec().encode(AccumulateItem.fromOperand(op), enc);
    return enc.finish();
  }
}

const DEFAULT_TRANSFER_GAS: u64 = 10000;

/**
 * Builder for an encoded `AccumulateItem::PendingTransfer` blob, suitable for
 * `TestAccumulate.setItem(i, ...)`.
 *
 * Defaults: source=0, destination=0, amount=0, memo=empty (auto-padded to 128
 * bytes by the codec), gas=10000.
 */
export class TransferItem {
  static create(): TransferItem {
    return new TransferItem();
  }

  private _source: u32 = 0;
  private _destination: u32 = 0;
  private _amount: u64 = 0;
  private _memo: BytesBlob = BytesBlob.empty();
  private _gas: u64 = DEFAULT_TRANSFER_GAS;

  private constructor() {}

  withSource(v: u32): TransferItem {
    this._source = v;
    return this;
  }

  withDest(v: u32): TransferItem {
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

```
