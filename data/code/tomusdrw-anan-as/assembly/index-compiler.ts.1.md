---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/index-compiler.ts#L113-L258
title: assembly/index-compiler.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 1
chunk_total: 3
content_sha: 24c5070cf32040f2c370f8c01be4df83d6aeb8a2db8e37c4d38e302fcc7c2d6c
language: typescript
---
`assembly/index-compiler.ts` (lines 113–258)

```typescript
  // Read program_len (4 bytes, little-endian u32)
  const programLen = load<u32>(argsPtr + offset);
  offset += 4;

  // Read args_len (4 bytes, little-endian u32)
  const innerArgsLen = load<u32>(argsPtr + offset);
  offset += 4;

  // we don't have enough data - prevent u32 overflow by casting to u64
  if (u64(argsLen) - u64(offset) !== u64(programLen) + u64(innerArgsLen)) {
    return setPanicResult();
  }

  // Read program code
  const spiProgram: u8[] = [];
  for (let i: u32 = 0; i < programLen; i++) {
    spiProgram.push(load<u8>(argsPtr + offset + i));
  }
  offset += programLen;

  // Read inner program args (remaining bytes)
  const innerArgs: u8[] = [];
  for (let i: u32 = 0; i < innerArgsLen; i++) {
    innerArgs.push(load<u8>(argsPtr + offset + i));
  }
  offset += innerArgsLen;

  // Parse SPI program and prepare memory layout
  const preallocateMemoryPages: u32 = 0;
  const useBlockGas = true;
  const program = prepareProgram(
    InputKind.SPI,
    HasMetadata.Yes,
    spiProgram,
    [],
    [],
    [],
    innerArgs,
    preallocateMemoryPages,
    useBlockGas,
  );

  // Create interpreter
  const int = new Interpreter(program.program, program.registers, program.memory);
  interpreter = int;
  int.gas.set(gas);
  int.nextPc = pc;

  // Run until terminal status, handling host calls along the way
  while (true) {
    // Execute until the interpreter stops
    while (int.nextSteps(u32.MAX_VALUE)) {}

    if (int.status !== Status.HOST) {
      // Terminal status: HALT, PANIC, FAULT, or OOG
      break;
    }

    // Handle host call: pass ecalli index + r7-r12 to the imported host_call_6b
    const ecalli = i64(int.exitCode);
    const r7 = host_call_6b(
      ecalli,
      int.registers[7],
      int.registers[8],
      int.registers[9],
      int.registers[10],
      int.registers[11],
      int.registers[12],
    );
    const r8 = host_call_r8();

    // Write results back to registers
    int.registers[7] = r7;
    int.registers[8] = r8;
    // Resume: nextPc was already set by the interpreter when it hit HOST status
  }

  // Build output
  const resultData = readResultData(int);
  const status = int.status;
  const isShort = status === Status.PANIC || status === Status.FAULT || status === Status.OOG;
  const dataLen: u32 = <u32>resultData.length;
  const totalLen: u32 = isShort ? 5 : 1 + 4 + 8 + 4 + dataLen;
  const buf: u32 = <u32>heap.alloc(totalLen);

  // Status (1 byte)
  store<u8>(buf, status);

  // exitCode (4 bytes)
  store<u32>(buf + 1, int.exitCode);

  if (!isShort) {
    // Gas left (8 bytes)
    store<u64>(buf + 5, int.gas.get());
    // PC (4 bytes)
    store<u32>(buf + 13, int.pc);
    // Result data
    for (let i: u32 = 0; i < dataLen; i++) {
      store<u8>(buf + 17 + i, resultData[i]);
    }
  }

  // Clean up
  int.memory.free();
  interpreter = null;

  return packResult(buf, totalLen);
}

/**
 * Read from inner PVM program memory.
 * @param addr Address in inner program's memory space
 * @param len Number of bytes to read
 * @returns Packed i64: lower 32 bits = pointer, upper 32 bits = length
 *          Buffer contains the data. Returns len=0 on page fault.
 */
export function host_read_memory(addr: u32, len: u32): i64 {
  const int = interpreter;
  if (int === null || len === 0) {
    return packResult(0, 0);
  }

  const result = new Uint8Array(len);
  const faultRes = new MaybePageFault();
  int.memory.bytesRead(faultRes, addr, result, 0);

  if (faultRes.isFault) {
    return packResult(0, 0);
  }

  // Allocate buffer and copy data
  const buf = <u32>heap.alloc(len);
  for (let i: u32 = 0; i < len; i++) {
    store<u8>(buf + i, result[i]);
  }

  return packResult(buf, len);
}

/**
 * Write to inner PVM program memory.
 * @param addr Address in inner program's memory space
 * @param dataPtr Pointer to data in interpreter/WASM memory
 * @param dataLen Number of bytes to write
 * @returns 1 on success, 0 on page fault
 */
```
