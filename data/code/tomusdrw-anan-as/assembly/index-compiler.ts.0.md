---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/index-compiler.ts#L1-L120
title: assembly/index-compiler.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-27T09:49:56+01:00'
last_modified: '2026-04-27T09:49:56+01:00'
chunk_index: 0
chunk_total: 3
content_sha: 2c009fc3a18a29d4646ddfb78d85bd2c39a3a43865bfd959945ae646b920ec0e
language: typescript
---
`assembly/index-compiler.ts` (lines 1–120)

```typescript
/**
 * PVM-in-PVM Entry Point for WASM Compiler Target
 *
 * This module is the entry point for the `compiler` build target, which compiles
 * the anan-as PVM interpreter to PVM bytecode itself. This enables PVM-in-PVM
 * testing and execution, where the inner PVM program runs inside an interpreter
 * that is itself running on PVM.
 *
 * == Host Call Handling ==
 * When the inner program executes an `ecalli` instruction, this module calls the
 * imported `host_call_6b(ecalli, r7..r12) -> r7` and `host_call_r8() -> r8`
 * functions. The import adapter is responsible for:
 *   - Determining which registers contain pointers for each ecalli
 *   - Translating inner PVM addresses using `host_read_memory` / `host_write_memory`
 *   - Implementing the actual host call logic
 *
 * The `host_read_memory` and `host_write_memory` exports are only valid to call
 * from within `host_call_6b` (i.e. while the interpreter is paused on a host call).
 *
 * == Input Format (main) ==
 * [8:gas][4:pc][4:spi-program-len][4:inner-args-len][...spi-program][...inner-args]
 *
 * == Output Format ==
 * All functions return packed i64: lower 32 bits = pointer, upper 32 bits = length
 *
 * For HALT (successful completion):
 *   [1:status][4:exit_code][8:gas][4:pc][...result]
 *
 * For PANIC/FAULT/OOG (errors):
 *   [1:status][4:exit_code]
 */

import { HasMetadata, InputKind, prepareProgram } from "./api-utils";
import { host_call_6b, host_call_r8 } from "./env";
import { Interpreter, Status } from "./interpreter";
import { MaybePageFault } from "./memory";

/** Pack a WASM pointer and length into a single i64 for the SPI result convention.
 * Lower 32 bits = pointer, upper 32 bits = length.
 */
function packResult(ptr: u32, len: u32): i64 {
  return (ptr as i64) | ((len as i64) << 32);
}

/** Persistent interpreter instance (accessible by host_read_memory / host_write_memory) */
let interpreter: Interpreter | null = null;

function setPanicResult(): i64 {
  const buf: u32 = <u32>heap.alloc(5);
  store<u8>(buf, Status.PANIC);
  store<u32>(buf + 1, 0);
  return packResult(buf, 5);
}

/** Read the result data from a halted interpreter */
function readResultData(int: Interpreter): u8[] {
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

/**
 * Main entry point following wasm-pvm convention.
 * @param argsPtr Pointer to input arguments (PVM address 0xFEFF0000)
 * @param argsLen Length of arguments in bytes
 * @returns Packed i64: lower 32 bits = result pointer, upper 32 bits = result length
 */
export function main(argsPtr: u32, argsLen: u32): i64 {
  // 8 (gas) + 4 (pc) + 4 (spi-program-len) + 4 (inner-args-len) + ? (spi-program) + ? (inner-args) = 20 + ? bytes
  if (argsLen < 20) {
    return setPanicResult();
  }

  let offset: u32 = 0;
  // Read gas (8 bytes, little-endian u64)
  const gas = load<u64>(argsPtr + offset);
  offset += 8;

  // Read pc (4 bytes, little-endian u32)
  const pc = load<u32>(argsPtr + offset);
  offset += 4;

  // Read program_len (4 bytes, little-endian u32)
  const programLen = load<u32>(argsPtr + offset);
  offset += 4;

  // Read args_len (4 bytes, little-endian u32)
  const innerArgsLen = load<u32>(argsPtr + offset);
  offset += 4;

```
