---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/api-utils.ts#L124-L258'
title: assembly/api-utils.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-27T09:49:56+01:00'
last_modified: '2026-04-27T09:49:56+01:00'
chunk_index: 1
chunk_total: 3
content_sha: cbb2757b999d4c9eb42cae2836e057dbff390efecb2c196994f0ab9ec286ac05
language: typescript
---
`assembly/api-utils.ts` (lines 124–258)

```typescript
  const vmOptions = new VmRunOptions();
  vmOptions.logs = logs;
  vmOptions.dumpMemory = dumpMemory;

  return vmRunOnce(vmInput, vmOptions);
}

/** Next available pvm id. */
let nextPvmId: u32 = 0;
/** Currently allocated pvms. */
const pvms = new Map<u32, Interpreter>();

/**
 * Allocate new PVM instance to execute given program.
 *
 * NOTE: the PVM MUST be de-allocated using `pvmDestroy`.
 */
export function pvmStart(program: StandardProgram): u32 {
  const vmInput = new VmInput(program.program, program.memory, program.registers);

  nextPvmId += 1;
  pvms.set(nextPvmId, vmInit(vmInput));
  return nextPvmId;
}

/** Deallocate PVM resources. */
export function pvmDestroy(pvmId: u32): VmOutput | null {
  if (pvms.has(pvmId)) {
    const int = pvms.get(pvmId);
    pvms.delete(pvmId);
    return vmDestroy(int, false);
  }
  return null;
}

/** Set register values of a paused PVM. */
export function pvmSetRegisters(pvmId: u32, registers: u64[]): void {
  if (pvms.has(pvmId)) {
    const int = pvms.get(pvmId);
    const safeIter = registers.length < NO_OF_REGISTERS ? registers.length : NO_OF_REGISTERS;
    for (let i = 0; i < safeIter; i++) {
      int.registers[i] = registers[i];
    }
  }
}

/**
 * Read a continuous chunk of memory from given PVM instance.
 *
 * @deprecated Use `pvmGetPagePointer` instead to read memory directly from WASM linear memory
 * on the JS side with no additional WASM-side allocations.
 */
export function pvmReadMemory(pvmId: u32, address: u32, length: u32): Uint8Array | null {
  if (pvms.has(pvmId)) {
    const int = pvms.get(pvmId);
    const faultRes = new MaybePageFault();
    const result = int.memory.getMemory(faultRes, address, length);
    if (!faultRes.isFault) {
      return result;
    }
  }
  return null;
}

/**
 * Returns the WASM linear memory pointer (byte offset) for the backing buffer of the page at `page`
 * in the given PVM instance.
 *
 * Returns `0` if the PVM does not exist, the page does not exist, or the page is not readable.
 *
 * Use this instead of `pvmReadMemory` to read memory efficiently from the JS side:
 * ```ts
 * let pagesRead = 0;
 * for (let address = start; address < end; address += PAGE_SIZE) {
 *   const page = address >> PAGE_SIZE_SHIFT;
 *   const ptr = pvmGetPagePointer(pvmId, page);
 *   if (ptr === 0) {
 *     throw new Error(`Page fault at ${page << PAGE_SIZE_SHIFT}`);
 *   }
 *   destination.set(
 *     new Uint8Array(wasm.instance.exports.memory.buffer, ptr, Math.min(end - address, PAGE_SIZE)),
 *     pagesRead << PAGE_SIZE_SHIFT,
 *   );
 *   pagesRead += 1;
 * }
 * ```
 */
export function pvmGetPagePointer(pvmId: u32, page: u32): usize {
  if (pvms.has(pvmId)) {
    const int = pvms.get(pvmId);
    return int.memory.getPagePointer(page);
  }
  return 0;
}

/** Write a chunk of memory to given PVM instance. */
export function pvmWriteMemory(pvmId: u32, address: u32, data: Uint8Array): boolean {
  if (pvms.has(pvmId)) {
    const int = pvms.get(pvmId);
    const faultRes = new MaybePageFault();

    // Preflight: verify the entire target range is accessible before writing
    const tempBuffer = new Uint8Array(data.length);
    int.memory.bytesRead(faultRes, address, tempBuffer, 0);
    if (faultRes.isFault) {
      return false;
    }

    // Now perform the actual write
    faultRes.isFault = false;
    faultRes.isAccess = false;
    int.memory.bytesWrite(faultRes, address, data, 0);
    if (!faultRes.isFault) {
      return true;
    }
  }
  return false;
}

/** Resume execution of paused VM. */
export function pvmResume(pvmId: u32, gas: Gas, pc: u32, logs: boolean = false): VmPause | null {
  if (pvms.has(pvmId)) {
    const int = pvms.get(pvmId);
    int.nextPc = pc;
    int.gas.set(gas);
    vmExecute(int, logs);

    const pause = new VmPause();
    pause.status = int.status;
    pause.exitCode = int.exitCode;
    pause.pc = int.pc;
    pause.nextPc = int.nextPc;
    pause.gas = int.gas.get();
    pause.registers = int.registers.slice(0);

```
