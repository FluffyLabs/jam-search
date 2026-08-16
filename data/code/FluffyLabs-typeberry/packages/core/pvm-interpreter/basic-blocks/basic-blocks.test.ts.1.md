---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/basic-blocks/basic-blocks.test.ts#L94-L140
title: packages/core/pvm-interpreter/basic-blocks/basic-blocks.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 9a766810b79b05df8ddaac9545624830cd212a1ccb7c7d3fa6e12648a136f58a
language: typescript
---
`packages/core/pvm-interpreter/basic-blocks/basic-blocks.test.ts` (lines 94–140)

```typescript
  it("should correctly detect basic blocks when distance between instructions is longer than 24", () => {
    const code = new Uint8Array([
      Instruction.TRAP,
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
      Instruction.JUMP_IND,
    ]);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array([0b0000_0001, 0b0000_0000, 0b0000_0000, 0b1000_0000]), 32));

    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, mask);

    const expectedStartingBasicBlockIndices = [0, 26];

    for (let i = 0; i < 32; i++) {
      assert.strictEqual(basicBlocks.isBeginningOfBasicBlock(i), expectedStartingBasicBlockIndices.includes(i));
    }
  });
});
```
