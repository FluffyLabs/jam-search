---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/context.ts#L1-L106
title: sdk/jam/accumulate/context.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 2
content_sha: e758766c1531586fcf1aa782eb8ec669265ab1d6294e390c95a300b82f142b0f
language: typescript
---
`sdk/jam/accumulate/context.ts` (lines 1–106)

```typescript
/**
 * Accumulate invocation context.
 *
 * Provides convenience methods for parsing arguments, encoding responses,
 * and accessing accumulate-item codecs. Codecs are created lazily — only
 * when first accessed.
 */

import { Bytes32, BytesBlob } from "../../core/bytes";
import { Bytes32Codec } from "../../core/codec/bytes32";
import { Decoder } from "../../core/codec/decode";
import { Encoder } from "../../core/codec/encode";
import { readFromMemory } from "../../core/mem";
import { ptrAndLen } from "../../core/pack";
import { panic } from "../../core/panic";
import { ResultN } from "../../core/result";
import { EcalliResult } from "../../ecalli";
import { checkpoint as checkpoint_, yield_result } from "../../ecalli/accumulate";
import { transfer as transfer_ } from "../../ecalli/accumulate/transfer";
import { gas } from "../../ecalli/general/gas";
import { AccumulateArgs, AccumulateArgsCodec, OptionalCodeHashCodec, Response, ResponseCodec } from "../service";
import { CurrentServiceData } from "../service-data";
import { ServiceId } from "../types";
import { Admin } from "./admin";
import { ChildServices } from "./child-services";
import { AccumulateFetcher } from "./fetcher";
import { AccumulateItemCodec, OperandCodec, PendingTransferCodec, WorkExecResultCodec } from "./item";
import { Memo } from "./memo";
import { AccumulatePreimages } from "./preimages";
import { SelfService } from "./self-service";

export enum TransferError {
  /** Unknown destination service (WHO sentinel). */
  Who = 0,
  /** Gas limit too low (LOW sentinel). */
  Low = 1,
  /** Insufficient funds (CASH sentinel). */
  Cash = 2,
}

export class AccumulateContext {
  static create(): AccumulateContext {
    return new AccumulateContext();
  }

  // Lazy codec fields
  private _accumulateArgs: AccumulateArgsCodec | null = null;
  private _response: ResponseCodec | null = null;
  private _optionalCodeHash: OptionalCodeHashCodec | null = null;
  private _workExecResult: WorkExecResultCodec | null = null;
  private _operand: OperandCodec | null = null;
  private _pendingTransfer: PendingTransferCodec | null = null;
  private _accumulateItem: AccumulateItemCodec | null = null;

  private constructor() {}

  get accumulateArgs(): AccumulateArgsCodec {
    if (this._accumulateArgs === null) this._accumulateArgs = AccumulateArgsCodec.create();
    return this._accumulateArgs!;
  }

  get response(): ResponseCodec {
    if (this._response === null) this._response = ResponseCodec.create();
    return this._response!;
  }

  get optionalCodeHash(): OptionalCodeHashCodec {
    if (this._optionalCodeHash === null) this._optionalCodeHash = OptionalCodeHashCodec.create(Bytes32Codec.create());
    return this._optionalCodeHash!;
  }

  get workExecResult(): WorkExecResultCodec {
    if (this._workExecResult === null) this._workExecResult = WorkExecResultCodec.create();
    return this._workExecResult!;
  }

  get operand(): OperandCodec {
    if (this._operand === null) this._operand = OperandCodec.create(this.workExecResult);
    return this._operand!;
  }

  get pendingTransfer(): PendingTransferCodec {
    if (this._pendingTransfer === null) this._pendingTransfer = PendingTransferCodec.create();
    return this._pendingTransfer!;
  }

  get accumulateItem(): AccumulateItemCodec {
    if (this._accumulateItem === null)
      this._accumulateItem = AccumulateItemCodec.create(this.operand, this.pendingTransfer);
    return this._accumulateItem!;
  }

  /** Return the remaining gas after this call (ecalli 0). */
  remainingGas(): i64 {
    return gas();
  }

  // ── Helper factories ────────────────────────────────────────────────

  /** Create an AccumulateFetcher for this context (fetch kinds 0-1, 14-15). */
  fetcher(bufSize: u32 = 1024): AccumulateFetcher {
    return AccumulateFetcher.create(bufSize);
  }

  /** Create an AccumulatePreimages helper (lookup + query/solicit/forget/provide). */
  preimages(bufSize: u32 = 1024): AccumulatePreimages {
```
