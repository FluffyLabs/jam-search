---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/api-internal.ts#L1-L107'
title: assembly/api-internal.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 0
chunk_total: 2
content_sha: d1f20daf8c94f81fd0550ddbe72c3ec3dc9efabf4108d5794561fb0a27d51adf
language: typescript
---
`assembly/api-internal.ts` (lines 1–107)

```typescript
import { InitialChunk, InitialPage, VmInput, VmOutput, VmRunOptions } from "./api-types";
import { Args, RELEVANT_ARGS } from "./arguments";
import { INSTRUCTIONS, MISSING_INSTRUCTION } from "./instructions";
import { Interpreter, Status } from "./interpreter";
import { MaybePageFault, Memory, MemoryBuilder } from "./memory";
import { Access, PAGE_SIZE, RESERVED_MEMORY } from "./memory-page";
import { portable } from "./portable";
import { decodeArguments, Program, resolveArguments } from "./program";

export function getAssembly(p: Program): string {
  const len = p.code.length;
  if (len === 0) {
    return "<seems that there is no code>";
  }

  let v = "";
  const argsRes = new Args();
  for (let i = 0; i < len; i++) {
    if (!p.mask.isInstruction(i)) {
      throw new Error("We should iterate only over instructions!");
    }

    const instruction = p.code[i];

    const iData = instruction >= <u8>INSTRUCTIONS.length ? MISSING_INSTRUCTION : INSTRUCTIONS[instruction];

    v += "\n";
    v += `${i}: `;
    v += iData.name;
    v += `(${instruction})`;

    const skipBytes = p.mask.skipBytesToNextInstruction(i);
    const args = decodeArguments(argsRes, iData.kind, p.code, i + 1, skipBytes);
    const argsArray = [args.a, args.b, args.c, args.d];
    const relevantArgs = RELEVANT_ARGS[iData.kind];
    for (let i = 0; i < relevantArgs; i++) {
      v += ` ${argsArray[i]}, `;
    }
    i += skipBytes;
  }
  return v;
}

export function buildMemory(builder: MemoryBuilder, pages: InitialPage[], chunks: InitialChunk[]): Memory {
  let sbrkIndex = RESERVED_MEMORY;

  for (let i = 0; i < pages.length; i++) {
    const initPage = pages[i];
    builder.setData(initPage.access, initPage.address, new Uint8Array(initPage.length));
    // find the highest writeable page and set the sbrk index to the end of that range.
    if (initPage.access === Access.Write) {
      const pageEnd = initPage.address + initPage.length;
      sbrkIndex = pageEnd < sbrkIndex ? sbrkIndex : pageEnd;
    }
  }

  for (let i = 0; i < chunks.length; i++) {
    const initChunk = chunks[i];
    // access should not matter now, since we created the pages already.
    const data = new Uint8Array(initChunk.data.length);
    for (let j = 0; j < data.length; j++) {
      data[j] = initChunk.data[j];
    }
    builder.setData(Access.None, initChunk.address, data);
    // consider initialized chunk lengths when setting sbrk index
    const chunkEnd = initChunk.address + initChunk.data.length;
    sbrkIndex = chunkEnd < sbrkIndex ? sbrkIndex : chunkEnd;
  }

  return builder.build(sbrkIndex);
}

/** Initialize new VM for execution. */
export function vmInit(input: VmInput): Interpreter {
  const int = new Interpreter(input.program, input.registers, input.memory);
  int.nextPc = input.pc;
  int.gas.set(input.gas);
  return int;
}

/** Initialize & run & destroy a VM in a single go. */
export function vmRunOnce(input: VmInput, options: VmRunOptions): VmOutput {
  const int = vmInit(input);
  vmExecute(int, options.logs);
  return vmDestroy(int, options.dumpMemory);
}

export function vmExecute(int: Interpreter, logs: boolean = false): void {
  let isOk = true;
  const argsRes = new Args();

  for (;;) {
    if (!isOk) {
      if (logs)
        console.log(`REGISTERS (final) = [${int.registers.map((x: u64) => `${x} (0x${x.toString(16)})`).join(", ")}]`);
      if (logs) console.log(`Finished with status: ${int.status}`);
      if (logs) console.log(`Exit code: ${int.exitCode}`);
      break;
    }

    if (logs) console.log(`PC = ${int.pc}`);
    if (logs) console.log(`GAS = ${int.gas.get()}`);
    if (logs) console.log(`STATUS = ${int.status}`);
    if (logs) console.log(`REGISTERS = [${int.registers.map((x: u64) => `${x} (0x${x.toString(16)})`).join(", ")}]`);

    if (logs && int.pc < u32(int.program.code.length)) {
      const instruction = int.program.code[int.pc];
```
