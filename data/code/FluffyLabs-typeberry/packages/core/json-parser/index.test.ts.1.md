---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/json-parser/index.test.ts#L153-L207
title: packages/core/json-parser/index.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: f11becf83ce6b9a2b4e653de30085c7b08883871e85410fcbafdb7d808bb7c9b
language: typescript
---
`packages/core/json-parser/index.test.ts` (lines 153–207)

```typescript
    const j = `{"v": true }`;
    class TestClass {
      static fromJson: FromJson<TestClass> = {
        k: json.optional("number"),
        v: json.optional("boolean"),
      };

      k?: number;
      v?: boolean;
    }

    const result = parseFromJson<TestClass>(JSON.parse(j), TestClass.fromJson);

    assert.strictEqual(result.k, undefined);
    assert.strictEqual(result.v, true);
  });

  await t.test("map", () => {
    const j = `{"k": { "a": "b", "c": "d" } }`;
    class TestClass {
      static fromJson: FromJson<TestClass> = {
        k: json.map("string", "string"),
      };

      k: Map<string, string> = new Map();
    }

    const result = parseFromJson<TestClass>(JSON.parse(j), TestClass.fromJson);
    assert.deepStrictEqual(
      result.k,
      new Map([
        ["a", "b"],
        ["c", "d"],
      ]),
    );
  });

  await t.test("map type mismatch", () => {
    const j = `{"k": [["a", "b"], ["c", "d"]]}`;
    class TestClass {
      static fromJson: FromJson<TestClass> = {
        k: json.map("string", "string"),
      };

      k: Map<string, string> = new Map();
    }

    try {
      parseFromJson<TestClass>(JSON.parse(j), TestClass.fromJson);
      assert.fail("Expected error to be thrown");
    } catch (e) {
      assert.strictEqual(`${e}`, "Error: [<root>.k] Error while parsing the value: Error: Expected map, got array");
    }
  });
});
```
