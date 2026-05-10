---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/machine.ts#L1-L63
title: packages/jam/jam-host-calls/refine/machine.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 493137779c9901904527d7378e39f04c5379d47a732094eef1f843a48185dfad
language: typescript
---
`packages/jam/jam-host-calls/refine/machine.ts` (lines 1–63)

```typescript
import { BytesBlob } from "@typeberry/bytes";
import {
  type HostCallHandler,
  type HostCallMemory,
  type HostCallRegisters,
  PvmExecution,
  traceRegisters,
  tryAsHostCallIndex,
} from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { resultToString, safeAllocUint8Array } from "@typeberry/utils";
import { type RefineExternalities, tryAsProgramCounter } from "../externalities/refine-externalities.js";
import { HostCallResult } from "../general/results.js";
import { logger } from "../logger.js";
import { CURRENT_SERVICE_ID, clampU64ToU32 } from "../utils.js";

const IN_OUT_REG = 7;

/**
 * Initiate a PVM instance with given program code and entrypoint (program counter).
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/34aa0134aa01?v=0.6.7
 */
export class Machine implements HostCallHandler {
  index = tryAsHostCallIndex(8);
  basicGasCost = tryAsSmallGas(10);
  currentServiceId = CURRENT_SERVICE_ID;
  tracedRegisters = traceRegisters(IN_OUT_REG, 8, 9);

  static new(refine: RefineExternalities) {
    return new Machine(refine);
  }

  private constructor(private readonly refine: RefineExternalities) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters, memory: HostCallMemory): Promise<PvmExecution | undefined> {
    // `p_o`: memory index where there program code starts
    const codeStart = regs.get(IN_OUT_REG);
    // `p_z`: length of the program code
    const codeLength = regs.get(8);
    // `i`: starting program counter
    const entrypoint = tryAsProgramCounter(regs.get(9));

    const codeLengthClamped = clampU64ToU32(codeLength);
    const code = BytesBlob.blobFrom(safeAllocUint8Array(codeLengthClamped));
    const codeLoadResult = memory.loadInto(code.raw, codeStart);
    if (codeLoadResult.isError) {
      logger.trace`[${this.currentServiceId}] MACHINE(${code.toStringTruncated()}, ${entrypoint}) <- PANIC`;
      return PvmExecution.Panic;
    }

    // NOTE: Highly unlikely, but machineId could potentially collide with HOST_CALL_RESULT.
    const machinInitResult = await this.refine.machineInit(code, entrypoint);
    logger.trace`[${this.currentServiceId}] MACHINE(${code.toStringTruncated()}, ${entrypoint}) <- ${resultToString(machinInitResult)}`;
    logger.insane`[${this.currentServiceId}] MACHINE(${code}, ${entrypoint}) <- ${resultToString(machinInitResult)}`;

    if (machinInitResult.isError) {
      regs.set(IN_OUT_REG, HostCallResult.HUH);
    } else {
      regs.set(IN_OUT_REG, machinInitResult.ok);
    }
  }
}
```
