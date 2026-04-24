---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/api-internal.ts#L104-L211
title: assembly/api-internal.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 1
chunk_total: 2
content_sha: af58b82a65b83071d2f3dd1effb00ceb896cfff2669eab60437a5d14486aabde
language: typescript
---
`assembly/api-internal.ts` (lines 104–211)

```typescript
    if (logs) console.log(`REGISTERS = [${int.registers.map((x: u64) => `${x} (0x${x.toString(16)})`).join(", ")}]`);

    if (logs && int.pc < u32(int.program.code.length)) {
      const instruction = int.program.code[int.pc];
      const iData = instruction >= <u8>INSTRUCTIONS.length ? MISSING_INSTRUCTION : INSTRUCTIONS[instruction];
      const skipBytes = int.program.mask.skipBytesToNextInstruction(int.pc);
      const args = resolveArguments(argsRes, iData.kind, int.program.code, int.pc + 1, skipBytes, int.registers);
      if (args !== null) {
        console.log(`ARGUMENTS:
  ${args.a} (${args.decoded.a}) = 0x${u64(args.a).toString(16)},
  ${args.b} (${args.decoded.b}) = 0x${u64(args.b).toString(16)},
  ${args.c} (${args.decoded.c}) = 0x${u64(args.c).toString(16)},
  ${args.d} (${args.decoded.d}) = 0x${u64(args.d).toString(16)}`);
      }
    }

    isOk = int.nextSteps();
  }
}

/** Destroy a running VM and consume the output. */
export function vmDestroy(int: Interpreter, dumpMemory: boolean = false): VmOutput {
  const output = new VmOutput();
  output.status = int.status;
  output.registers = int.registers.slice(0);
  output.pc = int.pc;
  output.gas = int.gas.get();
  if (dumpMemory) {
    output.memory = getOutputChunks(int.memory);
  }
  output.exitCode = int.exitCode;
  output.result = readResult(int);

  int.memory.free();
  return output;
}

function readResult(int: Interpreter): u8[] {
  if (int.status !== Status.HALT) {
    return [];
  }

  // JAM return convention
  const ptr_start = u32(int.registers[7] & u64(0xffff_ffff));
  const ptr_end = u32(int.registers[8] & u64(0xffff_ffff));

  // invalid output result
  if (ptr_start >= ptr_end) {
    return [];
  }

  // attempt to read the output memory (up to 1MB)
  const totalLength = ptr_end - ptr_start;
  if (totalLength > 1_024 * 1_024) {
    return [];
  }

  const result = new Uint8Array(totalLength);
  const faultRes = new MaybePageFault();
  int.memory.bytesRead(faultRes, ptr_start, result, 0);
  // we couldn't access the mem - i.e. no output
  if (faultRes.isFault) {
    return [];
  }

  // copy the Uint8Array to a regular array
  const out = new Array<u8>(totalLength);
  for (let i: u32 = 0; i < totalLength; i++) {
    out[i] = result[i];
  }
  return out;
}

function getOutputChunks(memory: Memory): InitialChunk[] {
  const chunks: InitialChunk[] = [];
  // @ts-ignore: AS returns T[], JS returns iterator - asArray handles both
  const pages: u32[] = portable.asArray<u32>(memory.pages.keys());
  let currentChunk: InitialChunk | null = null;
  for (let i = 0; i < pages.length; i++) {
    const pageIdx = pages[i];
    const page = memory.pages.get(pageIdx);

    // skip empty pages
    if (page.raw.page === null) {
      continue;
    }

    for (let n = 0; n < page.raw.data.length; n++) {
      const v = page.raw.data[n];
      if (v !== 0) {
        if (currentChunk !== null) {
          currentChunk.data.push(v);
        } else {
          currentChunk = new InitialChunk();
          currentChunk.address = pageIdx * PAGE_SIZE + n;
          currentChunk.data = [v];
        }
      } else if (currentChunk !== null) {
        chunks.push(currentChunk);
        currentChunk = null;
      }
    }
  }
  if (currentChunk !== null) {
    chunks.push(currentChunk);
  }
  return chunks;
}
```
