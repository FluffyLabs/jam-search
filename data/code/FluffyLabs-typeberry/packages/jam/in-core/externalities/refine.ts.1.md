---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine.ts#L104-L222
title: packages/jam/in-core/externalities/refine.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 7ca0b0fc0aa2e047a94c24a2cc1ab82e230b3f51cb27bea6fe0530da13556a5b
language: typescript
---
`packages/jam/in-core/externalities/refine.ts` (lines 104–222)

```typescript
    return Promise.resolve(Result.ok(pc));
  }

  machinePages(
    _machineIndex: MachineId,
    _pageStart: U64,
    _pageCount: U64,
    _requestType: MemoryOperation | null,
  ): Promise<Result<OK, PagesError>> {
    throw new Error("Method not implemented.");
  }

  machineVoidPages(_machineIndex: MachineId, _pageStart: U64, _pageCount: U64): Promise<Result<OK, ZeroVoidError>> {
    throw new Error("Method not implemented.");
  }

  machineZeroPages(_machineIndex: MachineId, _pageStart: U64, _pageCount: U64): Promise<Result<OK, ZeroVoidError>> {
    throw new Error("Method not implemented.");
  }

  machinePeekFrom(
    _machineIndex: MachineId,
    _destinationStart: U64,
    _sourceStart: U64,
    _length: U64,
    _destination: HostCallMemory,
  ): Promise<Result<OK, PeekPokeError>> {
    throw new Error("Method not implemented.");
  }

  machinePokeInto(
    _machineIndex: MachineId,
    _sourceStart: U64,
    _destinationStart: U64,
    _length: U64,
    _source: HostCallMemory,
  ): Promise<Result<OK, PeekPokeError>> {
    throw new Error("Method not implemented.");
  }

  async machineInit(code: BytesBlob, programCounter: ProgramCounter): Promise<Result<MachineId, ProgramDecoderError>> {
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/346400346400?v=0.7.2
    const deblobResult = ProgramDecoder.deblob(code.raw);
    if (deblobResult.isError) {
      return Result.error(deblobResult.error, deblobResult.details);
    }

    const manager = await PvmInstanceManager.new(this.pvmBackend);
    const innerPvm = await manager.getInstance();

    innerPvm.resetGeneric(code.raw, Number(programCounter), tryAsGas(0));

    // https://graypaper.fluffylabs.dev/#/ab2cdbd/348c00348c00?v=0.7.2
    // Binary search for the minimal free MachineId
    const arr = this.machines.array;
    let low = 0;
    let high = arr.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (arr[mid][0] > BigInt(mid)) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }

    const machineId = tryAsMachineId(low);
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/340501340b01?v=0.7.2
    this.machines.insert([machineId, innerPvm]);
    return Result.ok(machineId);
  }

  machineInvoke(
    machineIndex: MachineId,
    gas: BigGas,
    registers: HostCallRegisters,
  ): Promise<Result<MachineResult, NoMachineError>> {
    const entry = this.machines.findExact([machineIndex, NULL_INTERPRETER]);
    if (entry === undefined) {
      return Promise.resolve(Result.error(NoMachineError, () => `Machine not found (id: ${machineIndex})`));
    }

    const innerPvm = entry[1];

    // Prepare inner PVM
    innerPvm.registers.setAllEncoded(registers.getEncoded());
    innerPvm.gas.set(gas);

    // Execute program
    innerPvm.runProgram();

    // Status
    const status = innerPvm.getStatus();
    const exitParam = innerPvm.getExitParam() ?? 0;
    const remainingGas = tryAsBigGas(innerPvm.gas.get());
    const outRegisters = HostCallRegisters.fromRaw(new Uint8Array(innerPvm.registers.getAllEncoded()));

    let machineStatus: MachineStatus;
    if (status === Status.HOST) {
      machineStatus = { status, hostCallIndex: tryAsU64(exitParam) };
    } else if (status === Status.FAULT) {
      machineStatus = { status, address: tryAsU64(exitParam) };
    } else {
      machineStatus = { status };
    }

    return Promise.resolve(Result.ok({ result: machineStatus, gas: remainingGas, registers: outRegisters }));
  }

  exportSegment(segment: Segment): Result<SegmentIndex, SegmentExportError> {
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/335d03335d03?v=0.7.2
    const currentIndex = this.exportOffset + this.exportedSegments.length;
    if (currentIndex >= MAX_NUMBER_OF_EXPORTS_WP) {
      return Result.error(
        SegmentExportError,
        () =>
          `Maximum number of exported segments exceeded (offset: ${this.exportOffset}, exported: ${this.exportedSegments.length})`,
      );
    }
```
