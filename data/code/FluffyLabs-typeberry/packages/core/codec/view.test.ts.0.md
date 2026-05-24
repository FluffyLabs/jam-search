---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/view.test.ts#L1-L54
title: packages/core/codec/view.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5856318d4dbc0c7208bad5446bcce4df7368f8eae82fa1334c82067d65bf3f3a
language: typescript
---
`packages/core/codec/view.test.ts` (lines 1–54)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import { Decoder } from "./decoder.js";
import type { CodecRecord } from "./descriptor.js";
import * as codec from "./descriptors.js";
import { Encoder } from "./encoder.js";

describe("Codec view", () => {
  class MyClass {
    static Codec = codec.Class(MyClass, {
      name: codec.string,
      sequence: codec.sequenceVarLen(codec.u32),
      num: codec.varU32,
    });

    static create({ name, sequence, num }: CodecRecord<MyClass>) {
      return new MyClass(name, sequence, num);
    }

    private constructor(
      public readonly name: string,
      public readonly sequence: U32[],
      public readonly num: U32,
    ) {}
  }

  function testData() {
    const data = MyClass.create({
      name: "test",
      sequence: [1, 2, 3].map(tryAsU32),
      num: tryAsU32(2 ** 32 - 1),
    });
    const encoded = Encoder.encodeObject(MyClass.Codec, data);
    const view = Decoder.decodeObject(MyClass.Codec.View, encoded);

    return {
      encoded,
      view,
      data,
    };
  }

  it("should have nice toString", () => {
    const { view } = testData();

    assert.strictEqual(`${view}`, "View<MyClass>(cache: 0)");
    assert.strictEqual(`${view.sequence}`, "ViewField<View<MyClass>(cache: 1).sequence>");
    assert.strictEqual(`${view.sequence.view()}`, "SequenceView<u32>(cache: 0)");
    assert.strictEqual(`${view.sequence.view().get(0)}`, "ViewField<SequenceView<u32>(cache: 0)[0]>");
    assert.strictEqual(`${view.sequence.view().get(0)?.view()}`, "0x01000000");
    assert.strictEqual(`${view.num.view()}`, "4294967295");
  });
});
```
