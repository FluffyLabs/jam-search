---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/item.ts#L225-L301
title: sdk/jam/accumulate/item.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 2
chunk_total: 3
content_sha: b9b3302e5e6e56bc0d142f459d68959a5fabb713e11db2ecc8e8ce34aedbeb4a
language: typescript
---
`sdk/jam/accumulate/item.ts` (lines 225–301)

```typescript
// ─── AccumulateItem ───────────────────────────────────────────────────

/**
 * Discriminated union of accumulate items (operand or transfer).
 *
 * Use `isOperand` / `isTransfer` to check the kind, then access the
 * corresponding field via `.operand` or `.transfer`.
 */
export class AccumulateItem {
  private constructor(
    public readonly kind: AccumulateItemKind,
    private readonly _operand: Operand | null,
    private readonly _transfer: PendingTransfer | null,
  ) {}

  static fromOperand(op: Operand): AccumulateItem {
    return new AccumulateItem(AccumulateItemKind.Operand, op, null);
  }

  static fromTransfer(tx: PendingTransfer): AccumulateItem {
    return new AccumulateItem(AccumulateItemKind.Transfer, null, tx);
  }

  get isOperand(): bool {
    return this.kind === AccumulateItemKind.Operand;
  }

  get isTransfer(): bool {
    return this.kind === AccumulateItemKind.Transfer;
  }

  get operand(): Operand {
    assert(this._operand !== null, "AccumulateItem is not an operand");
    return this._operand!;
  }

  get transfer(): PendingTransfer {
    assert(this._transfer !== null, "AccumulateItem is not a transfer");
    return this._transfer!;
  }
}

export class AccumulateItemCodec implements TryDecode<AccumulateItem>, TryEncode<AccumulateItem> {
  static create(operand: OperandCodec, pendingTransfer: PendingTransferCodec): AccumulateItemCodec {
    return new AccumulateItemCodec(operand, pendingTransfer);
  }
  private constructor(
    private readonly operand: OperandCodec,
    private readonly pendingTransfer: PendingTransferCodec,
  ) {}

  decode(d: Decoder): Result<AccumulateItem, DecodeError> {
    const tag = d.varU32();
    if (d.isError) return Result.err<AccumulateItem, DecodeError>(DecodeError.MissingBytes);
    if (tag === AccumulateItemKind.Operand) {
      const r = d.object<Operand>(this.operand);
      if (r.isError) return Result.err<AccumulateItem, DecodeError>(r.error);
      return Result.ok<AccumulateItem, DecodeError>(AccumulateItem.fromOperand(r.okay!));
    }
    if (tag === AccumulateItemKind.Transfer) {
      const r = d.object<PendingTransfer>(this.pendingTransfer);
      if (r.isError) return Result.err<AccumulateItem, DecodeError>(r.error);
      return Result.ok<AccumulateItem, DecodeError>(AccumulateItem.fromTransfer(r.okay!));
    }
    return Result.err<AccumulateItem, DecodeError>(DecodeError.InvalidData);
  }

  encode(v: AccumulateItem, e: Encoder): void {
    if (v.isOperand) {
      e.varU64(AccumulateItemKind.Operand);
      e.object<Operand>(this.operand, v.operand);
    } else {
      e.varU64(AccumulateItemKind.Transfer);
      e.object<PendingTransfer>(this.pendingTransfer, v.transfer);
    }
  }
}
```
