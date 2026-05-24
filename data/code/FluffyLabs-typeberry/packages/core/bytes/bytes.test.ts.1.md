---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/bytes.test.ts#L108-L199
title: packages/core/bytes/bytes.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 944a1c461ff90ccddc0b1304da16ecf62cba5bb415ce7a43a19d2fd8b0716be2
language: typescript
---
`packages/core/bytes/bytes.test.ts` (lines 108–199)

```typescript
      assert.strictEqual(result.isLess(), true);
    });

    it("should return 'less' when blob1 is shorter but blobs have the same prefix", () => {
      const blob1 = BytesBlob.blobFromNumbers([163, 246, 134]);
      const blob2 = BytesBlob.blobFromNumbers([163, 246, 134, 48]);

      const result = blob1.compare(blob2);

      assert.strictEqual(result.isLess(), true);
    });

    it("should return 'greater' when blob1 is longer but blobs have the same prefix", () => {
      const blob1 = BytesBlob.blobFromNumbers([163, 246, 134, 48]);
      const blob2 = BytesBlob.blobFromNumbers([163, 246, 134]);

      const result = blob1.compare(blob2);

      assert.strictEqual(result.isGreater(), true);
    });
  });

  describe("comparator", () => {
    it("should return Ordering.Equal", () => {
      const a = Bytes.parseBlob("0x111111");
      const b = Bytes.parseBlob("0x111111");

      const result = bytesBlobComparator(a, b);

      assert.strictEqual(result.isEqual(), true);
    });

    it("should return Ordering.Less", () => {
      const a = Bytes.parseBlob("0x011111");
      const b = Bytes.parseBlob("0x111111");

      const result = bytesBlobComparator(a, b);

      assert.strictEqual(result.isLess(), true);
    });

    it("should return Ordering.Greater", () => {
      const a = Bytes.parseBlob("0x211111");
      const b = Bytes.parseBlob("0x111111");

      const result = bytesBlobComparator(a, b);

      assert.strictEqual(result.isGreater(), true);
    });
  });
});

describe("Bytes", () => {
  it("should fail in case of length mismatch", () => {
    const input = "0x9c2d3bce7aa0a5857c67a85247365d2035f7d9daec2b515e86086584ad5e8644";

    try {
      Bytes.parseBytes(input, 16);
      assert.fail("Should throw an exception");
    } catch (e) {
      assert.strictEqual(`${e}`, "Error: Input string too long. Expected 16, got 32");
    }
  });

  it("parse 0x-prefixed, fixed length bytes vector", () => {
    const input = "0x9c2d3bce7aa0a5857c67a85247365d2035f7d9daec2b515e86086584ad5e8644";

    const bytes = Bytes.parseBytes(input, 32);

    assert.deepStrictEqual(
      bytes.raw,
      new Uint8Array([
        156, 45, 59, 206, 122, 160, 165, 133, 124, 103, 168, 82, 71, 54, 93, 32, 53, 247, 217, 218, 236, 43, 81, 94,
        134, 8, 101, 132, 173, 94, 134, 68,
      ]),
    );
  });

  it("parse non 0x-prefixed, fixed length bytes vector", () => {
    const input = "9c2d3bce7aa0a5857c67a85247365d2035f7d9daec2b515e86086584ad5e8644";

    const bytes = Bytes.parseBytesNoPrefix(input, 32);

    assert.deepStrictEqual(
      bytes.raw,
      new Uint8Array([
        156, 45, 59, 206, 122, 160, 165, 133, 124, 103, 168, 82, 71, 54, 93, 32, 53, 247, 217, 218, 236, 43, 81, 94,
        134, 8, 101, 132, 173, 94, 134, 68,
      ]),
    );
  });
});
```
