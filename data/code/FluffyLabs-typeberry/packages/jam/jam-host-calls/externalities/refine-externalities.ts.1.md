---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/refine-externalities.ts#L111-L167
title: packages/jam/jam-host-calls/externalities/refine-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: d238d77a92e3d6e29f71b5ac46e62b09624d47ea423aae02e8f4f667334f5172
language: typescript
---
`packages/jam/jam-host-calls/externalities/refine-externalities.ts` (lines 111–167)

```typescript
  getExportedSegments(): readonly Segment[];

  /** Forget a previously started nested VM. Return its current program counter.*/
  machineExpunge(machineIndex: MachineId): Promise<Result<ProgramCounter, NoMachineError>>;

  /** Set given range of pages as non-accessible and re-initialize them with zeros. */
  machineVoidPages(machineIndex: MachineId, pageStart: U64, pageCount: U64): Promise<Result<OK, ZeroVoidError>>;

  /** Set given range of pages as writeable and initialize them with zeros. */
  machineZeroPages(machineIndex: MachineId, pageStart: U64, pageCount: U64): Promise<Result<OK, ZeroVoidError>>;

  /** Copy a fragment of memory from `machineIndex` into given destination memory. */
  machinePeekFrom(
    machineIndex: MachineId,
    destinationStart: U64,
    sourceStart: U64,
    length: U64,
    destination: HostCallMemory,
  ): Promise<Result<OK, PeekPokeError>>;

  /** Write a fragment of memory into `machineIndex` from given source memory. */
  machinePokeInto(
    machineIndex: MachineId,
    sourceStart: U64,
    destinationStart: U64,
    length: U64,
    source: HostCallMemory,
  ): Promise<Result<OK, PeekPokeError>>;

  /** Start an inner PVM instance with given entry point and starting code. */
  machineInit(code: BytesBlob, programCounter: ProgramCounter): Promise<Result<MachineId, ProgramDecoderError>>;

  /** Run a previously initialized PVM instance with given gas and registers. */
  machineInvoke(
    machineIndex: MachineId,
    gas: BigGas,
    registers: HostCallRegisters,
  ): Promise<Result<MachineResult, NoMachineError>>;

  /**
   * Export segment for future retrieval.
   *
   * Returns the index assigned to that segment or an error if there is too many already exported.
   */
  exportSegment(segment: Segment): Result<SegmentIndex, SegmentExportError>;

  /** Lookup a historical preimage. */
  historicalLookup(serviceId: ServiceId | null, hash: Blake2bHash): Promise<BytesBlob | null>;

  /** Change access to and/or zero the value of memory. */
  machinePages(
    machineIndex: MachineId,
    pageStart: U64,
    pageCount: U64,
    requestType: MemoryOperation | null,
  ): Promise<Result<OK, PagesError>>;
}
```
