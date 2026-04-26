---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/item.ts#L1-L127
title: sdk/jam/accumulate/item.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 3
content_sha: 22a2c0760d990959f5e22fab43cd7fdf0a066eaa9beb7ddcf82b76c7029e4a22
language: typescript
---
`sdk/jam/accumulate/item.ts` (lines 1–127)

```typescript
/**
 * Types for accumulate-context items: operands (work results) and transfers.
 *
 * During accumulation, services call `fetch(kind=15, index)` to retrieve items.
 * Each item is a tagged union: tag=0 for operand, tag=1 for transfer.
 *
 * @see https://graypaper.fluffylabs.dev
 */

import { Bytes32, BytesBlob } from "../../core/bytes";
import { DecodeError, Decoder, TryDecode } from "../../core/codec/decode";
import { Encoder, TryEncode } from "../../core/codec/encode";
import { Result } from "../../core/result";

/** Discriminator tag for accumulate items. */
export enum AccumulateItemKind {
  /** Work result from the refine phase. */
  Operand = 0,
  /** Incoming balance transfer from another service. */
  Transfer = 1,
}

/** Outcome of work-item refinement. */
export enum WorkExecResultKind {
  /** Successful execution — followed by output blob. */
  Ok = 0,
  /** Ran out of gas. */
  OutOfGas = 1,
  /** Unexpected termination (panic). */
  Panic = 2,
  /** Incorrect number of exported segments. */
  IncorrectNumberOfExports = 3,
  /** Digest too large. */
  DigestTooBig = 4,
  /** Code not available in state. */
  BadCode = 5,
  /** Code exceeds maximum size. */
  CodeOversize = 6,
}

// ─── WorkExecResult ───────────────────────────────────────────────────

/** Result of work-item execution during refine. */
export class WorkExecResult {
  static create(kind: WorkExecResultKind, okBlob: BytesBlob): WorkExecResult {
    return new WorkExecResult(kind, okBlob);
  }

  private constructor(
    public kind: WorkExecResultKind,
    /** Output blob — only present when kind == Ok. */
    public okBlob: BytesBlob,
  ) {}

  get isOk(): bool {
    return this.kind === WorkExecResultKind.Ok;
  }
}

export class WorkExecResultCodec implements TryDecode<WorkExecResult>, TryEncode<WorkExecResult> {
  static create(): WorkExecResultCodec {
    return new WorkExecResultCodec();
  }
  private constructor() {}

  decode(d: Decoder): Result<WorkExecResult, DecodeError> {
    const kind = d.varU32();
    if (d.isError) return Result.err<WorkExecResult, DecodeError>(DecodeError.MissingBytes);
    if (kind > u32(WorkExecResultKind.CodeOversize)) {
      return Result.err<WorkExecResult, DecodeError>(DecodeError.InvalidData);
    }
    if (kind === WorkExecResultKind.Ok) {
      const blob = d.bytesVarLen();
      if (d.isError) return Result.err<WorkExecResult, DecodeError>(DecodeError.MissingBytes);
      return Result.ok<WorkExecResult, DecodeError>(WorkExecResult.create(kind, blob));
    }
    return Result.ok<WorkExecResult, DecodeError>(WorkExecResult.create(kind, BytesBlob.empty()));
  }

  encode(v: WorkExecResult, e: Encoder): void {
    e.varU64(u64(v.kind));
    if (v.kind === WorkExecResultKind.Ok) {
      e.bytesVarLen(v.okBlob);
    }
  }
}

// ─── Operand ──────────────────────────────────────────────────────────

/**
 * Operand: a work result from the refine phase.
 *
 * Encoding order matches the Gray Paper / typeberry codec:
 *   hash(32) + exportsRoot(32) + authorizerHash(32) + payloadHash(32)
 *   + gas(varU64) + result(WorkExecResult) + authorizationOutput(blob)
 */
export class Operand {
  static create(
    hash: Bytes32,
    exportsRoot: Bytes32,
    authorizerHash: Bytes32,
    payloadHash: Bytes32,
    gas: u64,
    result: WorkExecResult,
    authorizationOutput: BytesBlob,
  ): Operand {
    return new Operand(hash, exportsRoot, authorizerHash, payloadHash, gas, result, authorizationOutput);
  }

  private constructor(
    /** Work package hash. */
    public hash: Bytes32,
    /** Exports root hash. */
    public exportsRoot: Bytes32,
    /** Authorizer hash. */
    public authorizerHash: Bytes32,
    /** Payload hash from the work item. */
    public payloadHash: Bytes32,
    /** Gas allocated for accumulation. */
    public gas: u64,
    /** Refine execution result. */
    public result: WorkExecResult,
    /** Authorization output data. */
    public authorizationOutput: BytesBlob,
  ) {}
}

```
