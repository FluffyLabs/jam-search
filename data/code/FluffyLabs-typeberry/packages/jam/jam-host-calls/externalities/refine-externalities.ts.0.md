---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/refine-externalities.ts#L1-L115
title: packages/jam/jam-host-calls/externalities/refine-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: a264e6b136b2dad0ea617c7097f6a73317ff1bf75c565e275c61a98b7a671660
language: typescript
---
`packages/jam/jam-host-calls/externalities/refine-externalities.ts` (lines 1–115)

```typescript
import type { Segment, SegmentIndex, ServiceId } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import type { Blake2bHash } from "@typeberry/hash";
import { tryAsU64, type U64 } from "@typeberry/numbers";
import type { HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { type BigGas, Status } from "@typeberry/pvm-interface";
import type { ProgramDecoderError } from "@typeberry/pvm-interpreter/program-decoder/program-decoder.js";
import { asOpaqueType, type OK, type Opaque, type Result } from "@typeberry/utils";

/**
 * Program counter is a 64-bit unsigned integer that points to the next instruction
 *
 * https://graypaper.fluffylabs.dev/#/1c979cb/2e3f012e3f01?v=0.7.1
 */
export type ProgramCounter = Opaque<U64, "ProgramCounter[u64]">;
/** Convert a number into ProgramCounter. */
export const tryAsProgramCounter = (v: number | bigint): ProgramCounter => asOpaqueType(tryAsU64(v));

/** Running PVM instance identifier. */
export type MachineId = Opaque<U64, "MachineId[u64]">;
/** Convert a number into PVM instance identifier. */
export const tryAsMachineId = (v: number | bigint): MachineId => asOpaqueType(tryAsU64(v));

export class MachineInstance {
  async run(gas: BigGas, registers: HostCallRegisters): Promise<MachineResult> {
    return {
      result: {
        status: Status.OK,
      },
      gas,
      registers,
    };
  }
}

export type MachineStatus =
  | {
      status: typeof Status.HOST;
      hostCallIndex: U64;
    }
  | {
      status: typeof Status.FAULT;
      address: U64;
    }
  | {
      status: typeof Status.OK | typeof Status.HALT | typeof Status.PANIC | typeof Status.OOG;
    };

/** Data returned by a machine invocation. */
export type MachineResult = {
  result: MachineStatus;
  gas: BigGas;
  registers: HostCallRegisters;
};

/** Types of possbile operations to request by Pages host call. */
export enum MemoryOperation {
  /** Zeroes memory and set access to unreadable. */
  Void = 0,
  /** Zeroes memory and set access to read-only. */
  ZeroRead = 1,
  /** Zeroes memory and set access to read-write. */
  ZeroWrite = 2,
  /** Preserve memory and set access to read-only. */
  Read = 3,
  /** Preserve memory and set access to read-write. */
  Write = 4,
}

/** Convert a number into MemoryOperation or null (if invalid). */
export const toMemoryOperation = (v: number | bigint): MemoryOperation | null =>
  v <= MemoryOperation.Write && v >= MemoryOperation.Void ? Number(v) : null;

/** An error that may occur during `peek` or `poke` host call. */
export enum PeekPokeError {
  /** Source page fault. */
  SourcePageFault = 0,
  /** Destination page fault. */
  DestinationPageFault = 1,
  /** No machine under given machine index. */
  NoMachine = 2,
}

export enum ZeroVoidError {
  /** No machine under given machine index. */
  NoMachine = 0,
  /** Attempting to void or zero non-accessible page. */
  InvalidPage = 1,
}

export enum PagesError {
  /** No machine under given machine index. */
  NoMachine = 0,
  /** Invalid memory operation. */
  InvalidOperation = 1,
  /** Attempting to change non-accessible page or trying to preserve value of voided page. */
  InvalidPage = 2,
}

/** Error machine is not found. */
export const NoMachineError = Symbol("Machine index not found.");
export type NoMachineError = typeof NoMachineError;

/** Too many segments already exported. */
export const SegmentExportError = Symbol("Too many segments already exported.");
export type SegmentExportError = typeof SegmentExportError;

/** Host functions external invocations available during refine phase. */
export interface RefineExternalities {
  /** Get the segments exported during this work item's refinement. */
  getExportedSegments(): readonly Segment[];

  /** Forget a previously started nested VM. Return its current program counter.*/
  machineExpunge(machineIndex: MachineId): Promise<Result<ProgramCounter, NoMachineError>>;

```
