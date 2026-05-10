---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/poke.ts#L1-L71
title: packages/jam/jam-host-calls/refine/poke.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 5ff054857bb1ed0664a857dabb9bb2c3816972a158ecf6df17dd2d1d23b8d64f
language: typescript
---
`packages/jam/jam-host-calls/refine/poke.ts` (lines 1–71)

```typescript
import {
  type HostCallHandler,
  type HostCallMemory,
  type HostCallRegisters,
  PvmExecution,
  traceRegisters,
  tryAsHostCallIndex,
} from "@typeberry/pvm-host-calls";
import { type IGasCounter, tryAsSmallGas } from "@typeberry/pvm-interface";
import { assertNever, resultToString } from "@typeberry/utils";
import { PeekPokeError, type RefineExternalities, tryAsMachineId } from "../externalities/refine-externalities.js";
import { HostCallResult } from "../general/results.js";
import { logger } from "../logger.js";
import { CURRENT_SERVICE_ID } from "../utils.js";

const IN_OUT_REG = 7;

/**
 * Copy a piece of local memory into nested PVM instance (machine).
 *
 * https://graypaper.fluffylabs.dev/#/7e6ff6a/340403340403?v=0.6.7
 */
export class Poke implements HostCallHandler {
  index = tryAsHostCallIndex(10);
  basicGasCost = tryAsSmallGas(10);
  currentServiceId = CURRENT_SERVICE_ID;
  tracedRegisters = traceRegisters(IN_OUT_REG, 8, 9, 10);

  static new(refine: RefineExternalities) {
    return new Poke(refine);
  }

  private constructor(private readonly refine: RefineExternalities) {}

  async execute(_gas: IGasCounter, regs: HostCallRegisters, memory: HostCallMemory): Promise<PvmExecution | undefined> {
    // `n`: machine index
    const machineIndex = tryAsMachineId(regs.get(IN_OUT_REG));
    // `s`: source memory start (nested vm)
    const sourceStart = regs.get(8);
    // `o`: destination memory start (local)
    const destinationStart = regs.get(9);
    // `z`: memory length
    const length = regs.get(10);

    const pokeResult = await this.refine.machinePokeInto(machineIndex, sourceStart, destinationStart, length, memory);
    logger.trace`[${this.currentServiceId}] POKE(${machineIndex}, ${sourceStart}, ${destinationStart}, ${length}) <- ${resultToString(pokeResult)}`;

    if (pokeResult.isOk) {
      regs.set(IN_OUT_REG, HostCallResult.OK);
      return;
    }

    const e = pokeResult.error;

    if (e === PeekPokeError.NoMachine) {
      regs.set(IN_OUT_REG, HostCallResult.WHO);
      return;
    }

    if (e === PeekPokeError.SourcePageFault) {
      return PvmExecution.Panic;
    }

    if (e === PeekPokeError.DestinationPageFault) {
      regs.set(IN_OUT_REG, HostCallResult.OOB);
      return;
    }

    assertNever(e);
  }
}
```
