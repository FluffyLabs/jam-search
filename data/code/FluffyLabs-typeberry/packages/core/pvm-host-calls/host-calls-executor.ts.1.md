---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/host-calls-executor.ts#L117-L183
title: packages/core/pvm-host-calls/host-calls-executor.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 88d2fe3af0c332a11c5f9aec4047c38dabba46d51439cf1ce8711d24c519fa68
language: typescript
---
`packages/core/pvm-host-calls/host-calls-executor.ts` (lines 117–183)

```typescript
        ${exitParam !== -1}
        "We know that the exit param is not null, because the status is 'Status.HOST'
      `;
      const hostCallIndex = tryAsHostCallIndex(exitParam);

      // retrieve the host call
      const hostCall = this.hostCalls.get(hostCallIndex);
      // NOTE: `basicGasCost(regs)` function is for compatibility reasons: pre GP 0.7.2
      const basicGasCost =
        typeof hostCall.basicGasCost === "number" ? hostCall.basicGasCost : hostCall.basicGasCost(registers);

      // calculate gas
      const gasBefore = gas.get();
      const underflow = gas.sub(basicGasCost);

      const pcLog = `[PC: ${pc}]`;
      if (underflow) {
        const gasAfterBasicGas = gas.get();
        this.hostCalls.traceHostCall(`${pcLog} OOG`, hostCallIndex, hostCall, registers, gasAfterBasicGas);
        this.ioTracer?.logSetGas(gasAfterBasicGas);
        return this.getReturnValue(Status.OOG, pvmInstance, registers, memory);
      }

      this.ioTracer?.logEcalli(hostCallIndex, pc, gasBefore, registers);
      this.hostCalls.traceHostCall(`${pcLog} Invoking`, hostCallIndex, hostCall, registers, gasBefore);
      ioTracker?.clear();
      const result = await hostCall.execute(gas, registers, memory);

      const gasAfter = gas.get();
      this.ioTracer?.logHostActions(ioTracker, gasBefore, gasAfter);
      this.hostCalls.traceHostCall(
        result === undefined ? `${pcLog} Result` : `${pcLog} Status(${PvmExecution[result]})`,
        hostCallIndex,
        hostCall,
        registers,
        gasAfter,
      );
      pvmInstance.registers.setAllEncoded(registers.getEncoded());

      if (result === PvmExecution.Halt) {
        return this.getReturnValue(Status.HALT, pvmInstance, registers, memory);
      }
      if (result === PvmExecution.Panic) {
        return this.getReturnValue(Status.PANIC, pvmInstance, registers, memory);
      }
      if (result === PvmExecution.OOG) {
        return this.getReturnValue(Status.OOG, pvmInstance, registers, memory);
      }
      if (result === undefined) {
        continue;
      }
      assertNever(result);
    }
  }

  async runProgram(program: Uint8Array, args: Uint8Array, initialPc: number, initialGas: Gas): Promise<ReturnValue> {
    const pvmInstance = await this.pvmInstanceManager.getInstance();
    pvmInstance.resetJam(program, args, initialPc, initialGas);

    try {
      this.ioTracer?.logProgram(program, args);
      return await this.execute(pvmInstance, initialPc);
    } finally {
      this.pvmInstanceManager.releaseInstance(pvmInstance);
    }
  }
}
```
