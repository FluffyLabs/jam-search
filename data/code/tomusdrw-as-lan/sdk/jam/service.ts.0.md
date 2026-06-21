---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/service.ts#L1-L124'
title: sdk/jam/service.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 5774bc940344fe675d42f529a09d2f78ea45cb69b99661eaaf11fa03c5ce7883
language: typescript
---
`sdk/jam/service.ts` (lines 1–124)

```typescript
import { BytesBlob } from "../core/bytes";
import { Bytes32Codec } from "../core/codec/bytes32";
import { DecodeError, Decoder, TryDecode } from "../core/codec/decode";
import { Encoder, TryEncode } from "../core/codec/encode";
import { ptrAndLen } from "../core/pack";
import { Result } from "../core/result";
import { CodeHash, CoreIndex, ServiceId, Slot, WorkPackageHash } from "./types";

// ─── Entry-point discriminant ─────────────────────────────────────────

/**
 * Distinguish a refine invocation from an `is_authorized` invocation by
 * input length.
 *
 * JAM self-authorizing services share a single entry function between
 * `is_authorized` (exactly 2 bytes — a u16 core index; GP Appendix B)
 * and `refine` (10+ bytes — a full RefineArgs encoding). This helper
 * centralizes that discriminant for the typical `index.ts` dispatch:
 *
 * ```typescript
 * export function refine(ptr: u32, len: u32): u64 {
 *   if (isRefineArgs(len)) return refine_(ptr, len);
 *   return is_authorized(ptr, len);
 * }
 * ```
 */
export function isRefineArgs(len: u32): bool {
  return len !== 2;
}

// ─── RefineArgs ───────────────────────────────────────────────────────

export class RefineArgs {
  static create(
    coreIndex: CoreIndex,
    itemIndex: u32,
    serviceId: ServiceId,
    payload: BytesBlob,
    workPackageHash: WorkPackageHash,
  ): RefineArgs {
    return new RefineArgs(coreIndex, itemIndex, serviceId, payload, workPackageHash);
  }

  private constructor(
    public coreIndex: CoreIndex,
    public itemIndex: u32,
    public serviceId: ServiceId,
    public payload: BytesBlob,
    public workPackageHash: WorkPackageHash,
  ) {}
}

export class RefineArgsCodec implements TryDecode<RefineArgs>, TryEncode<RefineArgs> {
  static create(): RefineArgsCodec {
    return new RefineArgsCodec();
  }
  private constructor() {}

  decode(d: Decoder): Result<RefineArgs, DecodeError> {
    const coreIndex = d.varU32();
    if (coreIndex > 0xffff) return Result.err<RefineArgs, DecodeError>(DecodeError.InvalidData);
    const itemIndex = d.varU32();
    const serviceId = d.varU32();
    const payload = d.bytesVarLen();
    const workPackageHash = d.bytes32();
    if (d.isError) return Result.err<RefineArgs, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<RefineArgs, DecodeError>(
      RefineArgs.create(u16(coreIndex), itemIndex, serviceId, payload, workPackageHash),
    );
  }

  encode(v: RefineArgs, e: Encoder): void {
    e.varU64(u64(v.coreIndex));
    e.varU64(u64(v.itemIndex));
    e.varU64(u64(v.serviceId));
    e.bytesVarLen(v.payload);
    e.bytes32(v.workPackageHash);
  }
}

// ─── AccumulateArgs ───────────────────────────────────────────────────

export class AccumulateArgs {
  static create(slot: Slot, serviceId: ServiceId, argsLength: u32): AccumulateArgs {
    return new AccumulateArgs(slot, serviceId, argsLength);
  }

  private constructor(
    public slot: Slot,
    public serviceId: ServiceId,
    public argsLength: u32,
  ) {}
}

export class AccumulateArgsCodec implements TryDecode<AccumulateArgs>, TryEncode<AccumulateArgs> {
  static create(): AccumulateArgsCodec {
    return new AccumulateArgsCodec();
  }
  private constructor() {}

  decode(d: Decoder): Result<AccumulateArgs, DecodeError> {
    const slot = d.varU32();
    const serviceId = d.varU32();
    const argsLength = d.varU32();
    if (d.isError) return Result.err<AccumulateArgs, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<AccumulateArgs, DecodeError>(AccumulateArgs.create(slot, serviceId, argsLength));
  }

  encode(v: AccumulateArgs, e: Encoder): void {
    e.varU64(u64(v.slot));
    e.varU64(u64(v.serviceId));
    e.varU64(u64(v.argsLength));
  }
}

// ─── Response ─────────────────────────────────────────────────────────

/**
 * Response from a refine or accumulate entry point.
 *
 * Encoding: result(u64 LE) + data(bytesVarLen)
 */
export class Response {
  static create(result: i64, data: BytesBlob): Response {
```
