---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/program.test.ts#L102-L185
title: assembly/program.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 25b3e4db9e536d30649b77d9ad251f3c0387a3415d9f22cffb0ba56ee0e36c3e
language: typescript
---
`assembly/program.test.ts` (lines 102–185)

```typescript
      0, 0, 33, 51, 8, 1, 51, 9, 1, 40, 3, 0, 149, 119, 255, 81, 7, 12, 100, 138, 200, 152, 8, 100, 169, 40, 243, 100,
      135, 51, 8, 51, 9, 1, 50, 0, 73, 147, 82, 213, 0,
    ]);
    const program = deblob(raw, true);
    const assert = new Assert();
    assert.isEqual(
      program.mask.toString(),
      "Mask[0, 2, 1, 0, 2, 1, 0, 1, 0, 0, 2, 1, 0, 2, 1, 0, 1, 0, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, ]",
    );
    assert.isEqual(program.jumpTable.toString(), "JumpTable[]");
    assert.isEqual(
      program.basicBlocks.toString(),
      "BasicBlocks[0 -> start, 6 -> end, 8 -> startend, 9 -> start, 12 -> end, 15 -> start, 22 -> end, 24 -> start, 30 -> end, 31 -> startend, ]",
    );
    assert.isEqual(program.gasCosts.toString(), "GasCosts[0 -> 3, 8 -> 1, 9 -> 2, 15 -> 4, 24 -> 4, 31 -> 1, ]");
    return assert;
  }),

  test("should construct basic blocks correctly based on skip", () => {
    const code = StaticArray.fromArray<u8>([
      opcode(trap),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      opcode(jump_ind),
    ]);
    const mask = new Mask(u8arr([0b0000_0001, 0b0000_0000, 0b0000_0000, 0b1000_0000]), 32);
    const basicBlocks = new BasicBlocks(code, mask);
    const assert = new Assert();
    assert.isEqual(
      mask.toString(),
      "Mask[0, 25, 25, 25, 25, 25, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, ]",
    );
    assert.isEqual(basicBlocks.toString(), "BasicBlocks[0 -> startend, 26 -> start, 31 -> end, ]");
    return assert;
  }),
  test("should parse jump table with large numbers", () => {
    const jumpTable = new JumpTable(
      10,
      u8arr([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0, 2, 2, 2, 0]),
    );
    const assert = new Assert();
    assert.isEqual(
      jumpTable.toString(),
      "JumpTable[0 -> 18446744073709551615, 1 -> 18446744073709551615, 2 -> 18446744073709551615, ]",
    );
    return assert;
  }),
];

function opcode(search: InstructionRun): u8 {
  const idx = RUN.indexOf(search);
  if (idx < 0) {
    throw new Error("Opcode not found in RUN table for instruction");
  }
  return u8(idx);
}
```
