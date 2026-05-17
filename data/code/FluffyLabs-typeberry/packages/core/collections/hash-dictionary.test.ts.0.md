---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/hash-dictionary.test.ts#L1-L83
title: packages/core/collections/hash-dictionary.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: a014973687437c50ff1e721eecb40e735a7c6587af1f516a20eb6e47681f1b92
language: typescript
---
`packages/core/collections/hash-dictionary.test.ts` (lines 1–83)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { HashDictionary } from "./hash-dictionary.js";

function key(n: number) {
  return Bytes.fill(HASH_SIZE, n);
}

describe("HashDictionary", () => {
  it("should return true/false for keys present in the dictionary", () => {
    const dict = HashDictionary.new();
    dict.set(key(1), "Hello World!");
    dict.set(key(2), "Hello!");

    assert.deepStrictEqual(dict.has(key(0)), false);
    assert.deepStrictEqual(dict.has(key(1)), true);
    assert.deepStrictEqual(dict.has(key(2)), true);
    assert.deepStrictEqual(dict.has(key(3)), false);
  });

  it("should set and get some values", () => {
    const dict = HashDictionary.new();
    dict.set(key(1), "Hello World!");
    dict.set(key(2), "Hello!");

    assert.deepStrictEqual(dict.get(key(0)), undefined);
    assert.deepStrictEqual(dict.get(key(1)), "Hello World!");
    assert.deepStrictEqual(dict.get(key(2)), "Hello!");
    assert.deepStrictEqual(dict.get(key(4)), undefined);
  });

  it("should remove some values", () => {
    const dict = HashDictionary.new();
    dict.set(key(1), "Hello World!");
    dict.set(key(2), "Hello!");
    assert.deepStrictEqual(dict.has(key(1)), true);
    assert.deepStrictEqual(dict.has(key(2)), true);

    dict.delete(key(0));
    dict.delete(key(1));
    dict.delete(key(3));

    assert.deepStrictEqual(dict.has(key(0)), false);
    assert.deepStrictEqual(dict.has(key(1)), false);
    assert.deepStrictEqual(dict.has(key(2)), true);
    assert.deepStrictEqual(dict.has(key(3)), false);
  });

  it("should iterate over values", () => {
    const dict = HashDictionary.new();
    dict.set(key(1), "Hello World!");
    dict.set(key(2), "Hello!");

    const values = Array.from(dict.values());

    assert.deepStrictEqual(values, ["Hello World!", "Hello!"]);
  });

  it("should iterate over keys", () => {
    const dict = HashDictionary.new();
    dict.set(key(1), "Hello World!");
    dict.set(key(2), "Hello!");

    const keys = Array.from(dict.keys());

    assert.deepStrictEqual(keys, [key(1), key(2)]);
  });

  it("should iterate over entries", () => {
    const dict = HashDictionary.new();
    dict.set(key(1), "Hello World!");
    dict.set(key(2), "Hello!");

    const values = Array.from(dict);

    assert.deepStrictEqual(values, [
      [key(1), "Hello World!"],
      [key(2), "Hello!"],
    ]);
  });
});
```
