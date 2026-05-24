---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/program-decoder/program-decoder.test.ts#L1-L40
title: packages/core/pvm-interpreter/program-decoder/program-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c9f11294f694334df0a50e3cbd36be6f8e3904d479ea718c1cbd1425600bc346
language: typescript
---
`packages/core/pvm-interpreter/program-decoder/program-decoder.test.ts` (lines 1–40)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { BitVec } from "@typeberry/bytes";
import { JumpTable } from "./jump-table.js";
import { Mask } from "./mask.js";
import { ProgramDecoder } from "./program-decoder.js";

const code = [4, 7, 246, 4, 8, 10, 41, 135, 4, 0, 4, 7, 239, 190, 173, 222];

const jumpTableItemLength = 1;
const jumpTable = [5];
const bitMask = [73, 6];
const program = new Uint8Array([jumpTable.length, jumpTableItemLength, 16, ...jumpTable, ...code, ...bitMask]);

describe("ProgramDecoder", () => {
  it("should corectly decode instructions", () => {
    const programDecoder = ProgramDecoder.new(program);

    const result = programDecoder.getCode();

    assert.deepStrictEqual(result, new Uint8Array(code));
  });

  it("should corectly decode mask", () => {
    const programDecoder = ProgramDecoder.new(program);

    const result = programDecoder.getMask();

    assert.deepStrictEqual(result, Mask.new(BitVec.fromBlob(new Uint8Array(bitMask), code.length)));
  });

  it("should corectly decode jump table", () => {
    const programDecoder = ProgramDecoder.new(program);

    const result = programDecoder.getJumpTable();

    assert.deepStrictEqual(result, JumpTable.fromRaw(jumpTableItemLength, new Uint8Array(jumpTable)));
  });
});
```
