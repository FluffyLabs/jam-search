---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/nested-pvm.ts#L1-L92
title: sdk/jam/refine/nested-pvm.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: f0f3274584ddc56386a51196435e7397c1197a9f779b506450b6d069035933c1
language: typescript
---
`sdk/jam/refine/nested-pvm.ts` (lines 1–92)

```typescript
import { BytesBlob } from "../../core/bytes";
import { Decoder } from "../../core/codec/decode";
import { panic } from "../../core/panic";
import { ResultN } from "../../core/result";
import { ExitReason, InvokeIo, Machine, OutOfBounds, PageAccess } from "./machine";

/** SPI memory-layout constants (Z_P, Z_Z, Z_I). */
export const SPI_PAGE_SIZE: u32 = 1 << 12;
export const SPI_SEGMENT_SIZE: u32 = 1 << 16;
export const SPI_MAX_ARGS_LEN: u32 = 1 << 24;
export const SPI_RO_START: u32 = SPI_SEGMENT_SIZE;
export const SPI_ARGS_SEGMENT_START: u32 = 0xffff_ffff - SPI_SEGMENT_SIZE - SPI_MAX_ARGS_LEN + 1; // 0xFEFF_0000
export const SPI_STACK_SEGMENT_END: u32 = SPI_ARGS_SEGMENT_START - SPI_SEGMENT_SIZE; // 0xFEFE_0000
const R0_INITIAL: u64 = 0xffff_0000;

/** Reasons a well-formed SPI setup can fail — used by {@link NestedPvm.fromSpiChecked}. */
export enum SpiError {
  /** Decoder ran out of bytes or produced an error before the blob was fully consumed. */
  MalformedBlob = 0,
  /** Decoder finished successfully but extra bytes were left over. */
  TrailingBytes = 1,
  /** `args.length` exceeds `SPI_MAX_ARGS_LEN` (16 MiB). */
  ArgsTooLarge = 2,
  /** Host rejected the program with HUH — code blob has no valid entry at offset 0. */
  InvalidEntryPoint = 3,
}

/** Host-call-backed inner PVM set up from an SPI blob. */
export class NestedPvm {
  /**
   * Decode an SPI blob and set up an inner PVM. Panics on any setup error.
   *
   * Use this when the blob comes from a trusted source (e.g. embedded in the
   * service or produced by the outer runtime). For peer-controlled or
   * preimage-loaded blobs, prefer {@link NestedPvm.fromSpiChecked}.
   */
  static fromSpi(blob: BytesBlob, args: BytesBlob, gas: u64): NestedPvm {
    const r = NestedPvm.fromSpiChecked(blob, args, gas);
    if (r.isError) {
      const e = r.error;
      if (e === SpiError.MalformedBlob) panic("SPI: malformed blob");
      if (e === SpiError.TrailingBytes) panic("SPI: trailing bytes");
      if (e === SpiError.ArgsTooLarge) panic("SPI: args exceed MAX_ARGS_LEN");
      if (e === SpiError.InvalidEntryPoint) panic("SPI: invalid entry point");
      panic("SPI: unknown setup error");
    }
    return r.okay!;
  }

  /**
   * Decode an SPI blob and set up an inner PVM, returning a recoverable
   * error instead of panicking.
   *
   * Use this when the blob originates from untrusted input — e.g. loaded
   * from a preimage, fetched from a peer, or otherwise not under the
   * service's direct control.
   */
  static fromSpiChecked(blob: BytesBlob, args: BytesBlob, gas: u64): ResultN<NestedPvm, SpiError> {
    if (u32(args.length) > SPI_MAX_ARGS_LEN) {
      return ResultN.err<NestedPvm, SpiError>(SpiError.ArgsTooLarge);
    }

    const d = Decoder.fromBytesBlob(blob);
    const roLength = d.u24();
    const rwLength = d.u24();
    const heapPages = u32(d.u16());
    const stackSize = d.u24();
    const roBytes = d.bytesFixLen(roLength);
    const rwBytes = d.bytesFixLen(rwLength);
    const codeLength = d.u32();
    const codeBytes = d.bytesFixLen(codeLength);
    if (d.isError) return ResultN.err<NestedPvm, SpiError>(SpiError.MalformedBlob);
    if (!d.isFinished()) return ResultN.err<NestedPvm, SpiError>(SpiError.TrailingBytes);

    const machineResult = Machine.create(codeBytes, 0);
    if (machineResult.isError) {
      return ResultN.err<NestedPvm, SpiError>(SpiError.InvalidEntryPoint);
    }
    const machine = machineResult.okay;

    const io = InvokeIo.create(gas);
    io.setRegister(0, R0_INITIAL);
    io.setRegister(1, u64(SPI_STACK_SEGMENT_END));
    io.setRegister(7, u64(SPI_ARGS_SEGMENT_START));
    io.setRegister(8, u64(u32(args.length)));

    setupRegion(machine, SPI_RO_START, roBytes, PageAccess.Read);

    const heapStart = 2 * SPI_SEGMENT_SIZE + alignToSegment(roLength);
    setupRegion(machine, heapStart, rwBytes, PageAccess.ReadWrite);

    const heapZerosStart = heapStart + alignToPage(rwLength);
```
