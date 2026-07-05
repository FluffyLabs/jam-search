---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/refine-externalities.test.ts#L93-L189
title: packages/jam/jam-host-calls/externalities/refine-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 0ff2e4e662310b930c887a6f69acadeb2e4bd00bb165acc879d95ba8dedac6ea
language: typescript
---
`packages/jam/jam-host-calls/externalities/refine-externalities.test.ts` (lines 93–189)

```typescript
  machineInit(code: BytesBlob, programCounter: ProgramCounter): Promise<Result<MachineId, ProgramDecoderError>> {
    // check if the code is valid
    const program = ProgramDecoder.deblob(code.raw);
    if (program.isError) {
      return Promise.resolve(Result.error(program.error, () => "Test: error occurred"));
    }

    const val = this.machineStartData.get(code, programCounter);
    if (val === undefined) {
      throw new Error(`Unexpected call to machineStart with: ${code}, ${programCounter}`);
    }
    return Promise.resolve(Result.ok(val));
  }

  machinePeekFrom(
    machineIndex: MachineId,
    destinationStart: U64,
    sourceStart: U64,
    length: U64,
    destination: HostCallMemory,
  ): Promise<Result<OK, PeekPokeError>> {
    const val = this.machinePeekData.get(machineIndex, destinationStart, sourceStart, length, destination);
    if (val === undefined) {
      throw new Error(
        `Unexpected call to machinePeekFrom with: ${[machineIndex, destinationStart, sourceStart, length, destination]}`,
      );
    }
    return Promise.resolve(val);
  }

  machinePokeInto(
    machineIndex: MachineId,
    sourceStart: U64,
    destinationStart: U64,
    length: U64,
    source: HostCallMemory,
  ): Promise<Result<OK, PeekPokeError>> {
    const val = this.machinePokeData.get(machineIndex, sourceStart, destinationStart, length, source);
    if (val === undefined) {
      throw new Error(
        `Unexpected call to machinePokeInto with: ${[machineIndex, sourceStart, destinationStart, length, source]}`,
      );
    }
    return Promise.resolve(val);
  }

  async machineInvoke(
    machineIndex: MachineId,
    gas: BigGas,
    registers: HostCallRegisters,
  ): Promise<Result<MachineResult, NoMachineError>> {
    const machine = this.machineInvokeData.get(machineIndex);
    if (machine === undefined) {
      return Result.error(NoMachineError, () => `Machine not found. Call to machineInvoke with: ${machineIndex}`);
    }
    // run machine with given gas and registers
    const machineInvokeResult = await machine.run(gas, registers);
    // debug purposes
    machineInvokeResult.result = this.machineInvokeStatus;
    return Result.ok(machineInvokeResult);
  }

  exportSegment(segment: Segment): Result<SegmentIndex, SegmentExportError> {
    const result = this.exportSegmentData.get(segment);
    if (result === undefined) {
      throw new Error(`Unexpected call to exportSegment with: ${segment}`);
    }
    this.exportSegments.push(segment);
    return result;
  }

  historicalLookup(serviceId: ServiceId | null, hash: Blake2bHash): Promise<BytesBlob | null> {
    if (serviceId === null) {
      return Promise.resolve(null);
    }
    const val = this.historicalLookupData.get(serviceId, hash);
    if (val === undefined) {
      throw new Error(`Unexpected call to historicalLookup with: ${serviceId}, ${hash}`);
    }
    return Promise.resolve(val);
  }

  machinePages(
    machineIndex: MachineId,
    pageStart: U64,
    pageCount: U64,
    requestType: MemoryOperation | null,
  ): Promise<Result<OK, PagesError>> {
    const val = this.machinePagesData.get(machineIndex, pageStart, pageCount, requestType);
    if (val === undefined) {
      throw new Error(
        `Unexpected call to machinePages with: ${machineIndex}, ${pageStart}, ${pageCount}, ${requestType}`,
      );
    }
    return Promise.resolve(val);
  }
}
```
