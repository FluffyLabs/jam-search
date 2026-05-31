---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/test/calls.ts#L1-L133'
title: sdk/test/calls.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 3
content_sha: f450ae6afe92b40f289f76ef8b7143363c9a1c07fbb9279e59fcdae8c55905f2
language: typescript
---
`sdk/test/calls.ts` (lines 1–133)

```typescript
/**
 * Builders for invoking a service's `refine` / `accumulate` entrypoints from
 * AS tests, plus builders for the encoded `AccumulateItem` blobs the host
 * delivers via `TestAccumulate.setItem`.
 *
 * Use the chained `with*` setters to override defaults, then `.call(fn, ...)`
 * or `.build()`:
 *
 * ```typescript
 * const resp = RefineCall.create().withServiceId(10).call(refine, payload);
 * const result = AccumulateCall.create().withSlot(7).withServiceId(9).call(accumulate, 0);
 *
 * TestAccumulate.setItem(0, OperandItem.create().withOkBlob(payload).build());
 * TestAccumulate.setItem(1, TransferItem.create().withSource(1).withDest(2).withAmount(100).build());
 * ```
 */

import { Bytes32, BytesBlob } from "../core/bytes";
import { Decoder } from "../core/codec/decode";
import { Encoder } from "../core/codec/encode";
import { panic } from "../core/panic";
import {
  AccumulateItem,
  AccumulateItemCodec,
  Operand,
  OperandCodec,
  PendingTransfer,
  PendingTransferCodec,
  WorkExecResult,
  WorkExecResultCodec,
  WorkExecResultKind,
} from "../jam/accumulate/item";
import {
  AccumulateArgs,
  AccumulateArgsCodec,
  RefineArgs,
  RefineArgsCodec,
  Response,
  ResponseCodec,
} from "../jam/service";
import { CoreIndex, ServiceId, Slot, WorkPackageHash } from "../jam/types";
import { unpackResult } from "./utils";

/**
 * Build the AccumulateItemCodec used by the operand/transfer builders.
 * Kept private to this module — callers don't need to know about codec wiring.
 */
function accumulateItemCodec(): AccumulateItemCodec {
  return AccumulateItemCodec.create(OperandCodec.create(WorkExecResultCodec.create()), PendingTransferCodec.create());
}

const DEFAULT_SERVICE_ID: ServiceId = 42;
const DEFAULT_SLOT: Slot = 7;

/**
 * Builder for invoking a service's `refine` entrypoint.
 *
 * Defaults: coreIndex=0, itemIndex=0, serviceId=42, workPackageHash=zeros.
 */
export class RefineCall {
  static create(): RefineCall {
    return new RefineCall();
  }

  private _coreIndex: CoreIndex = 0;
  private _itemIndex: u32 = 0;
  private _serviceId: ServiceId = DEFAULT_SERVICE_ID;
  private _workPackageHash: WorkPackageHash = Bytes32.zero();

  private constructor() {}

  withCoreIndex(v: CoreIndex): RefineCall {
    this._coreIndex = v;
    return this;
  }

  withItemIndex(v: u32): RefineCall {
    this._itemIndex = v;
    return this;
  }

  withServiceId(v: ServiceId): RefineCall {
    this._serviceId = v;
    return this;
  }

  withWorkPackageHash(h: WorkPackageHash): RefineCall {
    this._workPackageHash = h;
    return this;
  }

  /**
   * Encode RefineArgs around `payload`, invoke `refineFn`, and return the
   * decoded `Response`. Panics if the response cannot be decoded.
   */
  call(refineFn: (ptr: u32, len: u32) => u64, payload: BytesBlob): Response {
    const args = RefineArgs.create(this._coreIndex, this._itemIndex, this._serviceId, payload, this._workPackageHash);
    const enc = Encoder.create();
    RefineArgsCodec.create().encode(args, enc);
    const buf = enc.finish();
    const raw = unpackResult(refineFn(buf.ptr(), buf.length));
    const r = ResponseCodec.create().decode(Decoder.fromBytesBlob(BytesBlob.wrap(raw)));
    if (r.isError) panic("RefineCall.call: response decode failed");
    return r.okay!;
  }
}

/**
 * Builder for invoking a service's `accumulate` entrypoint.
 *
 * Defaults: slot=7, serviceId=42.
 *
 * The caller is responsible for seeding any items (operands / transfers)
 * via `TestAccumulate.setItem(i, ...)` before calling `.call()`. The
 * `argsLength` argument to `.call()` must match the number of seeded items.
 */
export class AccumulateCall {
  static create(): AccumulateCall {
    return new AccumulateCall();
  }

  private _slot: Slot = DEFAULT_SLOT;
  private _serviceId: ServiceId = DEFAULT_SERVICE_ID;

  private constructor() {}

  withSlot(v: Slot): AccumulateCall {
    this._slot = v;
    return this;
  }

  withServiceId(v: ServiceId): AccumulateCall {
    this._serviceId = v;
```
