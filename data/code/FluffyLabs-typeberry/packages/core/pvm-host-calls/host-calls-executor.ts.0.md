---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/host-calls-executor.ts#L1-L122
title: packages/core/pvm-host-calls/host-calls-executor.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 2
content_sha: f5e34473070bf96e53c3060d931c5290b67e4d5ea53190eaaed0885d19c9e861
language: typescript
---
`packages/core/pvm-host-calls/host-calls-executor.ts` (lines 1–122)

```typescript
import { type Gas, type IPvmInterpreter, Status } from "@typeberry/pvm-interface";
import { assertNever, check, safeAllocUint8Array } from "@typeberry/utils";
import { EcalliTraceLogger } from "./ecalli-trace-logger.js";
import { PvmExecution, tryAsHostCallIndex } from "./host-call-handler.js";
import { HostCallMemory } from "./host-call-memory.js";
import { HostCallRegisters } from "./host-call-registers.js";
import type { HostCalls } from "./host-calls.js";
import type { PvmInstanceManager } from "./pvm-instance-manager.js";

/**
 * Outer VM return status.
 *
 * This is a limited status returned by outer VM.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/24a10124a101?v=0.7.2
 */
export enum ReturnStatus {
  /** Execution succesful. */
  OK = 0,
  /** Execution went out of gas. */
  OOG = 1,
  /** Execution trapped or panicked. */
  PANIC = 2,
}

export type ReturnValue<TGas = Gas> = {
  consumedGas: TGas;
} & (
  | {
      status: ReturnStatus.OK;
      memorySlice: Uint8Array;
    }
  | {
      status: ReturnStatus.OOG | ReturnStatus.PANIC;
    }
);

export class HostCallsExecutor {
  static new(
    pvmInstanceManager: PvmInstanceManager,
    hostCalls: HostCalls,
    ioTracer: EcalliTraceLogger | null = EcalliTraceLogger.create(),
  ) {
    return new HostCallsExecutor(pvmInstanceManager, hostCalls, ioTracer);
  }

  private constructor(
    private pvmInstanceManager: PvmInstanceManager,
    private hostCalls: HostCalls,
    private ioTracer: EcalliTraceLogger | null = EcalliTraceLogger.create(),
  ) {}

  private getReturnValue(
    status: Status,
    pvmInstance: IPvmInterpreter,
    registers: HostCallRegisters,
    memory: HostCallMemory,
  ): ReturnValue {
    const consumedGas = pvmInstance.gas.used();
    const pc = pvmInstance.getPC();
    const gas = pvmInstance.gas.get();

    if (status === Status.OOG) {
      this.ioTracer?.logOog(pc, gas, registers);
      return { consumedGas, status: ReturnStatus.OOG };
    }

    if (status === Status.HALT) {
      this.ioTracer?.logHalt(pc, gas, registers);

      const address = registers.get(7);
      // NOTE we are taking the the lower U32 part of the register, hence it's safe.
      const length = Number(registers.get(8) & 0xffff_ffffn);

      const result = safeAllocUint8Array(length);

      const loadResult = memory.loadInto(result, address);

      if (loadResult.isError) {
        return { consumedGas, status: ReturnStatus.OK, memorySlice: new Uint8Array() };
      }

      return { consumedGas, status: ReturnStatus.OK, memorySlice: result };
    }

    this.ioTracer?.logPanic(pvmInstance.getExitParam() ?? 0, pc, gas, registers);
    return { consumedGas, status: ReturnStatus.PANIC };
  }

  private async execute(pvmInstance: IPvmInterpreter, initialPc: number) {
    const ioTracker = this.ioTracer?.tracker() ?? null;
    const registers = HostCallRegisters.fromRaw(pvmInstance.registers.getAllEncoded());
    registers.ioTracker = ioTracker;
    const memory = HostCallMemory.new(pvmInstance.memory);
    memory.ioTracker = ioTracker;

    const gas = pvmInstance.gas;

    // log start of execution (note the PVM initialisation should be logged already)
    this.ioTracer?.logStart(initialPc, pvmInstance.gas.get(), registers);

    for (;;) {
      // execute program as much as we can
      pvmInstance.runProgram();
      // and update the PVM state
      registers.setEncoded(pvmInstance.registers.getAllEncoded());
      const status = pvmInstance.getStatus();
      const pc = pvmInstance.getPC();
      const exitParam = pvmInstance.getExitParam() ?? -1;

      if (status !== Status.HOST) {
        return this.getReturnValue(status, pvmInstance, registers, memory);
      }

      // get the PVM state now
      check`
        ${exitParam !== -1}
        "We know that the exit param is not null, because the status is 'Status.HOST'
      `;
      const hostCallIndex = tryAsHostCallIndex(exitParam);

      // retrieve the host call
```
