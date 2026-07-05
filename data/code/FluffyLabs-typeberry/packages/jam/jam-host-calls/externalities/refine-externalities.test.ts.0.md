---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/refine-externalities.test.ts#L1-L96
title: packages/jam/jam-host-calls/externalities/refine-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 20896ee8dd31ca9f4c73fe34dc1aacec4c58d21f2c75ab479d8452f745152cb5
language: typescript
---
`packages/jam/jam-host-calls/externalities/refine-externalities.test.ts` (lines 1–96)

```typescript
import type { Segment, SegmentIndex, ServiceId } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import { MultiMap } from "@typeberry/collections";
import type { Blake2bHash } from "@typeberry/hash";
import type { U64 } from "@typeberry/numbers";
import type { HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { type BigGas, Status } from "@typeberry/pvm-interface";
import {
  ProgramDecoder,
  type ProgramDecoderError,
} from "@typeberry/pvm-interpreter/program-decoder/program-decoder.js";
import { type OK, Result } from "@typeberry/utils";
import {
  type MachineId,
  type MachineInstance,
  type MachineResult,
  type MachineStatus,
  type MemoryOperation,
  NoMachineError,
  type PagesError,
  type PeekPokeError,
  type ProgramCounter,
  type RefineExternalities,
  type SegmentExportError,
  type ZeroVoidError,
} from "./refine-externalities.js";

export class TestRefineExt implements RefineExternalities {
  public readonly exportSegmentData: MultiMap<[Segment], Result<SegmentIndex, SegmentExportError>> = MultiMap.new(1, [
    (segment) => segment.toString(),
  ]);
  public readonly historicalLookupData: MultiMap<[ServiceId, Blake2bHash], BytesBlob | null> = MultiMap.new(2, [
    null,
    (key) => key.toString(),
  ]);

  public readonly machineInvokeData: Map<MachineId, MachineInstance> = new Map();
  public readonly machineStartData: MultiMap<[BytesBlob, ProgramCounter], MachineId> = MultiMap.new(2, [
    (code) => code.toString(),
    null,
  ]);
  public readonly machineExpungeData: MultiMap<
    Parameters<TestRefineExt["machineExpunge"]>,
    Result<ProgramCounter, NoMachineError>
  > = MultiMap.new(1);
  public readonly machinePeekData: MultiMap<Parameters<TestRefineExt["machinePeekFrom"]>, Result<OK, PeekPokeError>> =
    MultiMap.new(5);
  public readonly machinePokeData: MultiMap<Parameters<TestRefineExt["machinePokeInto"]>, Result<OK, PeekPokeError>> =
    MultiMap.new(5);
  public readonly machineVoidPagesData: MultiMap<
    Parameters<TestRefineExt["machineVoidPages"]>,
    Result<OK, ZeroVoidError>
  > = MultiMap.new(3);
  public readonly machineZeroPagesData: MultiMap<
    Parameters<TestRefineExt["machineZeroPages"]>,
    Result<OK, ZeroVoidError>
  > = MultiMap.new(3);
  public readonly machinePagesData: MultiMap<Parameters<TestRefineExt["machinePages"]>, Result<OK, PagesError>> =
    MultiMap.new(4);

  public machineInvokeStatus: MachineStatus = { status: Status.OK };

  private readonly exportSegments: Segment[] = [];

  getExportedSegments(): readonly Segment[] {
    return this.exportSegments;
  }

  machineExpunge(machineIndex: MachineId): Promise<Result<ProgramCounter, NoMachineError>> {
    const val = this.machineExpungeData.get(machineIndex);
    if (val === undefined) {
      throw new Error(`Unexpected call to machineExpunge with: ${machineIndex}`);
    }
    return Promise.resolve(val);
  }

  machineVoidPages(machineIndex: MachineId, pageStart: U64, pageCount: U64): Promise<Result<OK, ZeroVoidError>> {
    const val = this.machineVoidPagesData.get(machineIndex, pageStart, pageCount);
    if (val === undefined) {
      throw new Error(`Unexpected call to machineVoidPages with: ${machineIndex}, ${pageStart}, ${pageCount}`);
    }
    return Promise.resolve(val);
  }

  machineZeroPages(machineIndex: MachineId, pageStart: U64, pageCount: U64): Promise<Result<OK, ZeroVoidError>> {
    const val = this.machineZeroPagesData.get(machineIndex, pageStart, pageCount);
    if (val === undefined) {
      throw new Error(`Unexpected call to machineZeroPages with: ${machineIndex}, ${pageStart}, ${pageCount}`);
    }
    return Promise.resolve(val);
  }

  machineInit(code: BytesBlob, programCounter: ProgramCounter): Promise<Result<MachineId, ProgramDecoderError>> {
    // check if the code is valid
    const program = ProgramDecoder.deblob(code.raw);
    if (program.isError) {
```
