---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/api-debugger.ts#L147-L282
title: assembly/api-debugger.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 2da18c34f009e452ef5d7f010e710f3edfeb0cee9b0ee141b3fdda105d6785bd
language: typescript
---
`assembly/api-debugger.ts` (lines 147–282)

```typescript
  if (interpreter === null) {
    return flat;
  }

  const int = <Interpreter>interpreter;
  for (let i = 0; i < int.registers.length; i++) {
    let val = int.registers[i];
    for (let j = 0; j < REG_SIZE_BYTES; j++) {
      const index = i * REG_SIZE_BYTES + j;
      flat[index] = <u8>(val & u64(0xff));
      val = val >> u64(8);
    }
  }

  return flat;
}

export function setRegisters(flatRegisters: u8[]): void {
  if (interpreter === null) {
    return;
  }
  const int = <Interpreter>interpreter;
  fillRegisters(int.registers, flatRegisters);
}

export function getPageDump(index: u32): Uint8Array {
  if (interpreter === null) {
    return new Uint8Array(PAGE_SIZE).fill(0);
  }
  const int = <Interpreter>interpreter;
  const page = int.memory.pageDump(index);
  if (page === null) {
    return new Uint8Array(PAGE_SIZE).fill(0);
  }

  return page;
}

/**
 * Returns the WASM linear memory pointer (byte offset) for the backing buffer of the page at `page`.
 *
 * Returns `0` if the page does not exist or is not readable (page/access fault).
 *
 * Use this instead of `getMemory` to read memory efficiently from the JS side:
 * ```ts
 * let pagesRead = 0;
 * for (let address = start; address < end; address += PAGE_SIZE) {
 *   const page = address >> PAGE_SIZE_SHIFT;
 *   const ptr = getPagePointer(page);
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
export function getPagePointer(page: u32): usize {
  if (interpreter === null) {
    return 0;
  }
  const int = <Interpreter>interpreter;
  return int.memory.getPagePointer(page);
}

/**
 * Read a chunk of memory at `[address, address + length)`.
 *
 * Returns the requested memory chunk or `null` if reading triggered a page fault.
 *
 * @deprecated Getting memory like that is extremely inefficient (copying mulitple times)
 * and error prone (we may not be able to allocate).
 * Use `getPagePointer` instead to read memory directly from WASM linear memory on the JS side
 * with no additional WASM-side allocations.
 */
export function getMemory(address: u32, length: u32): Uint8Array | null {
  if (interpreter === null) {
    return null;
  }
  const int = <Interpreter>interpreter;
  const faultRes = new MaybePageFault();
  const result = int.memory.getMemory(faultRes, address, length);
  if (faultRes.isFault) {
    return null;
  }
  return result;
}

/**
 * Write given `data` under memory indices `[address, address + data.length)`.
 *
 * Returns `true` if the write was successful and `false` if page fault has been triggered.
 */
export function setMemory(address: u32, data: Uint8Array): boolean {
  if (interpreter === null) {
    return false;
  }
  const int = <Interpreter>interpreter;
  const end = address + data.length;
  const faultRes = new MaybePageFault();
  for (let i = address; i < end; i++) {
    int.memory.setU8(faultRes, i, data[i - address]);
    if (faultRes.isFault) {
      return false;
    }
  }
  return true;
}

function fillRegisters(registers: Registers, flat: u8[]): void {
  const len = registers.length * REG_SIZE_BYTES;
  if (len !== flat.length) {
    throw new Error(`Mismatching  registers size, got: ${flat.length}, expected: ${len}`);
  }

  for (let i = 0; i < registers.length; i++) {
    let num: u64 = u64(0);
    for (let j: u8 = 0; j < <u8>REG_SIZE_BYTES; j++) {
      const index = i * REG_SIZE_BYTES + j;
      num |= (<u64>flat[index]) << u64(j * 8);
    }
    registers[i] = num;
  }
}

function readPages(pageMap: Uint8Array): InitialPage[] {
  const pages: InitialPage[] = [];
  const codec = new Decoder(pageMap);
  while (!codec.isExhausted()) {
    const p = new InitialPage();
    p.address = codec.u32();
    p.length = codec.u32();
    p.access = codec.u8() > 0 ? Access.Write : Access.Read;
```
