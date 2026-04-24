---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-fetch-externalities.test.ts#L1-L109
title: packages/jam/transition/externalities/accumulate-fetch-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 3
content_sha: a6bbcac5dd6306b647269d0503fe266870a06a6c06c048cb86cf6ce1c9a55632
language: typescript
---
`packages/jam/transition/externalities/accumulate-fetch-externalities.test.ts` (lines 1–109)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { type EntropyHash, tryAsServiceGas, tryAsServiceId } from "@typeberry/block";
import { WorkExecResult } from "@typeberry/block/work-result.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { codec, Encoder } from "@typeberry/codec";
import { type ChainSpec, fullChainSpec, tinyChainSpec } from "@typeberry/config";
import { HASH_SIZE } from "@typeberry/hash";
import { TRANSFER_MEMO_BYTES } from "@typeberry/jam-host-calls/externalities/partial-state.js";
import { PendingTransfer } from "@typeberry/jam-host-calls/externalities/pending-transfer.js";
import { tryAsU64 } from "@typeberry/numbers";
import { Operand } from "../accumulate/operand.js";
import { AccumulateFetchExternalities } from "./accumulate-fetch-externalities.js";
import { TRANSFER_OR_OPERAND, TransferOperandKind, type TransferOrOperand } from "./fetch-externalities.js";

describe("AccumulateFetchExternalities", () => {
  const prepareOperands = (length: number) => {
    const operands: Operand[] = [];

    for (let i = 0; i < length; i++) {
      operands.push(
        Operand.create({
          authorizationOutput: BytesBlob.empty(),
          authorizerHash: Bytes.fill(HASH_SIZE, i + 1).asOpaque(),
          exportsRoot: Bytes.fill(HASH_SIZE, i + 2).asOpaque(),
          hash: Bytes.fill(HASH_SIZE, i + 4).asOpaque(),
          payloadHash: Bytes.fill(HASH_SIZE, i + 5).asOpaque(),
          result: WorkExecResult.ok(BytesBlob.empty()),
          gas: tryAsServiceGas(1_000),
        }),
      );
    }

    return operands;
  };

  const prepareTransfers = (length: number) => {
    const transfers: PendingTransfer[] = [];

    for (let i = 0; i < length; i++) {
      transfers.push(
        PendingTransfer.create({
          amount: tryAsU64(1000),
          source: tryAsServiceId(i),
          destination: tryAsServiceId(i + 1),
          gas: tryAsServiceGas(10),
          memo: Bytes.fill(TRANSFER_MEMO_BYTES, 0),
        }),
      );
    }

    return transfers;
  };

  // allTransfersAndOperands: transfers first, then operands
  const toAllTransfersAndOperands = (operands: Operand[], transfers: PendingTransfer[]): TransferOrOperand[] => {
    return [
      ...transfers.map((t): TransferOrOperand => ({ kind: TransferOperandKind.TRANSFER, value: t })),
      ...operands.map((o): TransferOrOperand => ({ kind: TransferOperandKind.OPERAND, value: o })),
    ];
  };

  // oneTransferOrOperand: transfers first, then operands (same as allTransfersAndOperands)
  const toOneTransferOrOperandAt = (
    operands: Operand[],
    transfers: PendingTransfer[],
    index: number,
  ): TransferOrOperand | null => {
    if (index >= transfers.length + operands.length) {
      return null;
    }
    if (index < transfers.length) {
      return { kind: TransferOperandKind.TRANSFER, value: transfers[index] };
    }
    return { kind: TransferOperandKind.OPERAND, value: operands[index - transfers.length] };
  };

  const encodeOneTransferOrOperand = (item: TransferOrOperand | null, chainSpec: ChainSpec): BytesBlob | null => {
    if (item === null) {
      return null;
    }
    return Encoder.encodeObject(TRANSFER_OR_OPERAND, item, chainSpec);
  };

  const prepareAccumulateData = ({
    chainSpec,
    operands,
    entropy,
    transfers,
  }: {
    chainSpec?: ChainSpec;
    operands?: Operand[];
    entropy?: EntropyHash;
    transfers?: PendingTransfer[];
  }) => {
    const defaultChainSpec = tinyChainSpec;
    const defaultEntropy: EntropyHash = Bytes.zero(HASH_SIZE).asOpaque();
    const defaultOperands: Operand[] = [];
    const defaultTransfers: PendingTransfer[] = [];
    return new AccumulateFetchExternalities(
      entropy ?? defaultEntropy,
      transfers ?? defaultTransfers,
      operands ?? defaultOperands,
      chainSpec ?? defaultChainSpec,
    );
  };

  it("should return different constants for different chain specs", () => {
```
