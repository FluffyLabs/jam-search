---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine.ts#L1-L112
title: packages/jam/in-core/externalities/refine.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 3f7591f9c93b4756ffcee0023df0d69c934603d29aede636b3090bfc64adaa9e
language: typescript
---
`packages/jam/in-core/externalities/refine.ts` (lines 1–112)

```typescript
import {
  MAX_NUMBER_OF_EXPORTS_WP,
  type Segment,
  type SegmentIndex,
  type ServiceId,
  tryAsSegmentIndex,
} from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import { SortedArray } from "@typeberry/collections";
import type { PvmBackend } from "@typeberry/config";
import type { Blake2bHash } from "@typeberry/hash";
import {
  type MachineId,
  type MachineResult,
  type MachineStatus,
  type MemoryOperation,
  NoMachineError,
  type PagesError,
  type PeekPokeError,
  type ProgramCounter,
  type RefineExternalities,
  SegmentExportError,
  tryAsMachineId,
  tryAsProgramCounter,
  type ZeroVoidError,
} from "@typeberry/jam-host-calls";
import { tryAsU64, type U64 } from "@typeberry/numbers";
import { Ordering } from "@typeberry/ordering";
import { type HostCallMemory, HostCallRegisters, PvmInstanceManager } from "@typeberry/pvm-host-calls";
import { type BigGas, type IPvmInterpreter, Status, tryAsBigGas, tryAsGas } from "@typeberry/pvm-interface";
import { ProgramDecoder, type ProgramDecoderError } from "@typeberry/pvm-interpreter";
import type { State } from "@typeberry/state";
import { type OK, Result } from "@typeberry/utils";

type MachineEntry = [MachineId, IPvmInterpreter];

/** Used when searching by MachineId only — the comparator ignores this field. */
const NULL_INTERPRETER = undefined as unknown as IPvmInterpreter;

const machineComparator = (a: MachineEntry, b: MachineEntry) => {
  if (a[0] < b[0]) {
    return Ordering.Less;
  }
  if (a[0] > b[0]) {
    return Ordering.Greater;
  }
  return Ordering.Equal;
};

/**
 * Parameters required to create a RefineExternalitiesImpl.
 */
export type RefineExternalitiesParams = {
  /** The service currently being refined. */
  currentServiceId: ServiceId;
  /** State at the lookup anchor block, used for historical preimage lookups. */
  lookupState: State;
  /** Export offset -- sum of exports from prior work items in this package. */
  exportOffset: number;
  /**
   * PVM backend to use for creating inner PVM instances.
   * NIT: Could accept PVMInstanceManager
   */
  pvmBackend: PvmBackend;
};

export class RefineExternalitiesImpl implements RefineExternalities {
  /** Inner PVM instances sorted by MachineId. */
  private machines: SortedArray<MachineEntry> = SortedArray.fromSortedArray(machineComparator);
  /** Service being refined (used as default for historicalLookup). */
  private readonly currentServiceId: ServiceId;
  /** State at the lookup anchor for preimage lookups. */
  private readonly lookupState: State;
  /** Segments exported by this work item during refinement. */
  private readonly exportedSegments: Segment[] = [];
  /** Offset for segment indexing (sum of exports from prior items). */
  private readonly exportOffset: number;
  /** PVM backend for creating inner machines. */
  private readonly pvmBackend: PvmBackend;

  static create(params: RefineExternalitiesParams) {
    return new RefineExternalitiesImpl(params);
  }

  private constructor(params: RefineExternalitiesParams) {
    this.currentServiceId = params.currentServiceId;
    this.lookupState = params.lookupState;
    this.exportOffset = params.exportOffset;
    this.pvmBackend = params.pvmBackend;
  }

  getExportedSegments(): readonly Segment[] {
    return this.exportedSegments;
  }

  machineExpunge(machineIndex: MachineId): Promise<Result<ProgramCounter, NoMachineError>> {
    // We just care about machineIndex
    const entry = this.machines.findExact([machineIndex, NULL_INTERPRETER]);
    if (entry === undefined) {
      return Promise.resolve(Result.error(NoMachineError, () => `Machine not found (id: ${machineIndex})`));
    }
    const pc = tryAsProgramCounter(entry[1].getPC());
    this.machines.removeOne(entry);
    return Promise.resolve(Result.ok(pc));
  }

  machinePages(
    _machineIndex: MachineId,
    _pageStart: U64,
    _pageCount: U64,
    _requestType: MemoryOperation | null,
  ): Promise<Result<OK, PagesError>> {
```
