---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-fetch-externalities.ts#L1-L65
title: packages/jam/transition/externalities/accumulate-fetch-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: c29a5e985aadc2ebb0694b4409be7eb837b8348df2da675da336956359a8ba46
language: typescript
---
`packages/jam/transition/externalities/accumulate-fetch-externalities.ts` (lines 1–65)

```typescript
import type { EntropyHash } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";
import { general, type PendingTransfer } from "@typeberry/jam-host-calls";
import type { U64 } from "@typeberry/numbers";
import type { Operand } from "../accumulate/operand.js";
import {
  getEncodedConstants,
  TRANSFER_OR_OPERAND,
  TRANSFERS_AND_OPERANDS,
  TransferOperandKind,
  type TransferOrOperand,
} from "./fetch-externalities.js";

export class AccumulateFetchExternalities implements general.IAccumulateFetch {
  readonly context = general.FetchContext.Accumulate;

  constructor(
    private readonly entropyHash: EntropyHash,
    private readonly transfers: PendingTransfer[],
    private readonly operands: Operand[],
    private readonly chainSpec: ChainSpec,
  ) {}

  constants(): BytesBlob {
    return getEncodedConstants(this.chainSpec);
  }

  entropy(): EntropyHash {
    return this.entropyHash;
  }

  allTransfersAndOperands(): BytesBlob | null {
    const transfersAndOperands: TransferOrOperand[] = this.transfers
      .map((transfer): TransferOrOperand => ({ kind: TransferOperandKind.TRANSFER, value: transfer }))
      .concat(
        this.operands.map((operand): TransferOrOperand => ({ kind: TransferOperandKind.OPERAND, value: operand })),
      );

    return Encoder.encodeObject(TRANSFERS_AND_OPERANDS, transfersAndOperands, this.chainSpec);
  }

  oneTransferOrOperand(index: U64): BytesBlob | null {
    if (index >= this.transfers.length + this.operands.length) {
      return null;
    }

    // Transfers-first ordering, consistent with allTransfersAndOperands()
    const kind = index < this.transfers.length ? TransferOperandKind.TRANSFER : TransferOperandKind.OPERAND;
    const transferOrOperand =
      kind === TransferOperandKind.TRANSFER
        ? ({ kind: TransferOperandKind.TRANSFER, value: this.transfers[Number(index)] } as const)
        : ({
            kind: TransferOperandKind.OPERAND,
            value: this.operands[Number(index) - this.transfers.length],
          } as const);

    if (transferOrOperand.value === undefined) {
      return null;
    }

    return Encoder.encodeObject(TRANSFER_OR_OPERAND, transferOrOperand, this.chainSpec);
  }
}
```
