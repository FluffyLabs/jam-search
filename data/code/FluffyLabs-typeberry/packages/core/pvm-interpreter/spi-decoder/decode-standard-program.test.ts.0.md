---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/spi-decoder/decode-standard-program.test.ts#L1-L78
title: packages/core/pvm-interpreter/spi-decoder/decode-standard-program.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9f598e8639892a3668224a0248086cfae49199b8a95fc4b2a80a17f8f2be355c
language: typescript
---
`packages/core/pvm-interpreter/spi-decoder/decode-standard-program.test.ts` (lines 1–78)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { decodeStandardProgram, MemorySegment } from "./decode-standard-program.js";

// E_3(|o|) = 04 00 00
const O_LENGTH = new Uint8Array([0x04, 0x00, 0x00]);

// E_3(|w|) = 02 00 00
const W_LENGTH = new Uint8Array([0x02, 0x00, 0x00]);

// E_2(z) = 03 00
const Z = new Uint8Array([0x03, 0x00]);

// E_3(s) = 20 00 00
const STACK_SIZE = new Uint8Array([0x20, 0x00, 0x00]);

// o = AB CD EF 01
const O = new Uint8Array([0xab, 0xcd, 0xef, 0x01]);

// w = 12 34
const W = new Uint8Array([0x12, 0x34]);

// E_4(|c|) = 06 00 00 00
const C_LENGTH = new Uint8Array([0x06, 0x00, 0x00, 0x00]);

// c = 12 34 56 78 9A BC
const C = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc]);

const PROGRAM = new Uint8Array([...O_LENGTH, ...W_LENGTH, ...Z, ...STACK_SIZE, ...O, ...W, ...C_LENGTH, ...C]);
const ARGS = new Uint8Array([0x1, 0x2, 0x3]);

describe("decodeStandardProgram", () => {
  const decodedProgram = decodeStandardProgram(PROGRAM, ARGS);

  it("should exctract code correctly", () => {
    assert.deepStrictEqual(decodedProgram.code, C);
  });

  it("should write args length to 9th register", () => {
    const registerIndex = 8;

    assert.strictEqual(decodedProgram.registers[registerIndex], BigInt(ARGS.length));
  });

  it("should prepare readable memory segments", () => {
    const expectedMemory = [
      {
        start: 65536,
        end: 69632,
        data: O,
      },
      {
        start: 4278124544,
        end: 4278128640,
        data: ARGS,
      },
      { start: 4278128640, end: 4278132736, data: null },
    ].map(MemorySegment.from);

    assert.deepStrictEqual(decodedProgram.memory.readable, expectedMemory);
  });

  it("should prepare writeable memory segments", () => {
    const expectedMemory = [
      { start: 196608, end: 200704, data: W },
      { start: 200704, end: 212992, data: null },
      { start: 4278054912, end: 4278059008, data: null },
    ].map(MemorySegment.from);

    assert.deepStrictEqual(decodedProgram.memory.writeable, expectedMemory);
  });

  it("sbrkIndex", () => {
    const expectedSbreak = 212992;

    assert.strictEqual(decodedProgram.memory.sbrkIndex, expectedSbreak);
  });
});
```
