---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/context.ts#L1-L107'
title: sdk/jam/refine/context.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 3718d97553204fdf6712cd49ec51d6641bcdb902d8a168d0ce54a95da65d55ae
language: typescript
---
`sdk/jam/refine/context.ts` (lines 1–107)

```typescript
/**
 * Refine invocation context.
 *
 * Provides convenience methods for parsing arguments and encoding responses.
 */

import { BytesBlob } from "../../core/bytes";
import { Decoder } from "../../core/codec/decode";
import { Encoder } from "../../core/codec/encode";
import { readFromMemory } from "../../core/mem";
import { ptrAndLen } from "../../core/pack";
import { panic } from "../../core/panic";
import { ResultN } from "../../core/result";
import { EcalliResult } from "../../ecalli";
import { gas } from "../../ecalli/general/gas";
import { export_segment } from "../../ecalli/refine";
import { RefineArgs, RefineArgsCodec, Response, ResponseCodec } from "../service";
import { CurrentServiceData } from "../service-data";
import { RefineFetcher } from "./fetcher";
import { InvalidEntryPoint, Machine } from "./machine";
import { NestedPvm, SpiError } from "./nested-pvm";
import { RefinePreimages } from "./preimages";

export class RefineContext {
  static create(): RefineContext {
    return new RefineContext();
  }

  readonly refineArgs: RefineArgsCodec;
  readonly response: ResponseCodec;

  private constructor() {
    this.refineArgs = RefineArgsCodec.create();
    this.response = ResponseCodec.create();
  }

  /** Return the remaining gas after this call (ecalli 0). */
  remainingGas(): i64 {
    return gas();
  }

  // ── Helper factories ────────────────────────────────────────────────

  /** Create a RefineFetcher for this context (fetch kinds 0-13). */
  fetcher(bufSize: u32 = 1024): RefineFetcher {
    return RefineFetcher.create(bufSize);
  }

  /** Create a RefinePreimages helper (lookup + historicalLookup). */
  preimages(bufSize: u32 = 1024): RefinePreimages {
    return RefinePreimages.create(bufSize);
  }

  /** Create a CurrentServiceData helper for storage read/write and account info. */
  serviceData(bufSize: u32 = 1024): CurrentServiceData {
    return CurrentServiceData.create(bufSize);
  }

  /** Create an inner PVM machine (ecalli 8). Delegates to Machine.create(). */
  machine(code: BytesBlob, entrypoint: u32): ResultN<Machine, InvalidEntryPoint> {
    return Machine.create(code, entrypoint);
  }

  /**
   * Decode an SPI blob and set up an inner PVM ready to invoke. Panics on
   * setup failure — use {@link nestedPvmFromSpiChecked} for untrusted input.
   *
   * See `NestedPvm` for the caller-driven invoke / host-call loop.
   */
  nestedPvmFromSpi(blob: BytesBlob, args: BytesBlob, gas: u64): NestedPvm {
    return NestedPvm.fromSpi(blob, args, gas);
  }

  /**
   * Same as {@link nestedPvmFromSpi} but returns a recoverable error instead
   * of panicking. Prefer this when the SPI blob comes from an untrusted
   * source (preimage, peer, etc.).
   */
  nestedPvmFromSpiChecked(blob: BytesBlob, args: BytesBlob, gas: u64): ResultN<NestedPvm, SpiError> {
    return NestedPvm.fromSpiChecked(blob, args, gas);
  }

  /** Parse raw refine arguments from (ptr, len). Panics on invalid data. */
  parseArgs(ptr: u32, len: u32): RefineArgs {
    const decoder = Decoder.fromBlob(readFromMemory(ptr, len));
    const r = this.refineArgs.decode(decoder);
    if (r.isError) panic("Failed to decode RefineArgs");
    if (!decoder.isFinished()) panic("Trailing bytes after RefineArgs");
    return r.okay!;
  }

  /**
   * Export a segment of data (ecalli 7).
   *
   * @returns segment index on success, or ExportSegmentError.Full if limit reached.
   */
  exportSegment(segment: BytesBlob): ResultN<u32, ExportSegmentError> {
    const result = export_segment(segment.ptr(), segment.length);
    if (result === EcalliResult.FULL) {
      return ResultN.err<u32, ExportSegmentError>(ExportSegmentError.Full);
    }
    return ResultN.ok<u32, ExportSegmentError>(u32(result));
  }

  /** Encode a response and return it as a ptrAndLen-packed u64. */
  respond(ecalliResult: i64, data: Uint8Array | null = null): u64 {
    const bytes = data === null ? BytesBlob.empty() : BytesBlob.wrap(data);
```
