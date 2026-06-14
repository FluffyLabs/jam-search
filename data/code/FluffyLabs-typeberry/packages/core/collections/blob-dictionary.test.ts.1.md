---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/blob-dictionary.test.ts#L112-L218
title: packages/core/collections/blob-dictionary.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 4c2e1f9360ed89fc2af32da6c4b3fb5cf39fff72dbbfc0b24ef12b0318ce2fc8
language: typescript
---
`packages/core/collections/blob-dictionary.test.ts` (lines 112–218)

```typescript
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef4"), { index: 4 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef5"), { index: 5 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef6"), { index: 6 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef7"), { index: 7 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef8"), { index: 8 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef9"), { index: 9 }] as const,
          ];

          const dict = BlobDictionary.new(threshold);

          for (const [key, val] of entries) {
            dict.set(key, val);
          }

          for (const [key, val] of entries) {
            const result = dict.get(key);
            assert.deepStrictEqual(val, result);
          }

          for (const [key] of entries) {
            dict.delete(key);
          }

          for (const [key] of entries) {
            assert.strictEqual(dict.has(key), false);
          }
        });

        function key(n: number) {
          return Bytes.fill(HASH_SIZE, n);
        }

        it("should return true/false for keys present in the dictionary", () => {
          const dict = BlobDictionary.new(threshold);
          dict.set(key(1), "Hello World!");
          dict.set(key(2), "Hello!");

          assert.deepStrictEqual(dict.has(key(0)), false);
          assert.deepStrictEqual(dict.has(key(1)), true);
          assert.deepStrictEqual(dict.has(key(2)), true);
          assert.deepStrictEqual(dict.has(key(3)), false);
        });

        it("should set and get some values", () => {
          const dict = BlobDictionary.new(threshold);
          dict.set(key(1), "Hello World!");
          dict.set(key(2), "Hello!");

          assert.deepStrictEqual(dict.get(key(0)), undefined);
          assert.deepStrictEqual(dict.get(key(1)), "Hello World!");
          assert.deepStrictEqual(dict.get(key(2)), "Hello!");
          assert.deepStrictEqual(dict.get(key(4)), undefined);
        });

        it("should remove some values", () => {
          const dict = BlobDictionary.new(threshold);
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
          const dict = BlobDictionary.new(threshold);
          dict.set(key(1), "Hello World!");
          dict.set(key(2), "Hello!");

          const values = Array.from(dict.values());

          assert.deepStrictEqual(values, ["Hello World!", "Hello!"]);
        });

        it("should iterate over keys", () => {
          const dict = BlobDictionary.new(threshold);
          dict.set(key(1), "Hello World!");
          dict.set(key(2), "Hello!");

          const keys = Array.from(dict.keys());

          assert.deepStrictEqual(keys, [key(1), key(2)]);
        });

        it("should iterate over entries", () => {
          const dict = BlobDictionary.new(threshold);
          dict.set(key(1), "Hello World!");
          dict.set(key(2), "Hello!");

          const values = Array.from(dict);

          assert.deepStrictEqual(values, [
            [key(1), "Hello World!"],
            [key(2), "Hello!"],
          ]);
        });
      });
    }
  });
});
```
