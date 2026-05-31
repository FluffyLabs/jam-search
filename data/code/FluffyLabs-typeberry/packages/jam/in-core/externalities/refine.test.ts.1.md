---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine.test.ts#L107-L208
title: packages/jam/in-core/externalities/refine.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 5
content_sha: 4f52587c6285ede0371ec78b2d4f8314171312d57ba64b67ff43f1285929a667
language: typescript
---
`packages/jam/in-core/externalities/refine.test.ts` (lines 107–208)

```typescript
      const result = await ext.historicalLookup(tryAsServiceId(42), hash);

      assert.strictEqual(result?.toString(), BytesBlob.parseBlob(PREIMAGE_DATA).toString());
    });

    it("should use currentServiceId when serviceId is null", async () => {
      const lookupState = createMockState([{ id: 42, preimages: [{ hash: PREIMAGE_HASH, blob: PREIMAGE_DATA }] }]);
      const ext = createExt({ lookupState });

      const hash = Bytes.parseBytes(PREIMAGE_HASH, HASH_SIZE).asOpaque();
      const result = await ext.historicalLookup(null, hash);

      assert.notStrictEqual(result, null);
    });

    it("should return null for non-existent service", async () => {
      const ext = createExt();

      const hash = Bytes.parseBytes(PREIMAGE_HASH, HASH_SIZE).asOpaque();
      const result = await ext.historicalLookup(tryAsServiceId(999), hash);

      assert.strictEqual(result, null);
    });

    it("should return null for non-existent preimage hash", async () => {
      const lookupState = createMockState([{ id: 42 }]);
      const ext = createExt({ lookupState });

      const hash = Bytes.parseBytes(PREIMAGE_HASH, HASH_SIZE).asOpaque();
      const result = await ext.historicalLookup(tryAsServiceId(42), hash);

      assert.strictEqual(result, null);
    });

    it("should look up from the correct service when multiple exist", async () => {
      const lookupState = createMockState([
        { id: 1, preimages: [{ hash: PREIMAGE_HASH, blob: "0x01" }] },
        { id: 2, preimages: [{ hash: PREIMAGE_HASH, blob: "0x02" }] },
      ]);
      const ext = createExt({ lookupState });

      const hash = Bytes.parseBytes(PREIMAGE_HASH, HASH_SIZE).asOpaque();
      const r1 = await ext.historicalLookup(tryAsServiceId(1), hash);
      const r2 = await ext.historicalLookup(tryAsServiceId(2), hash);

      assert.strictEqual(r1?.raw[0], 0x01);
      assert.strictEqual(r2?.raw[0], 0x02);
    });
  });

  describe("exportSegment", () => {
    it("should export a segment and return its index", () => {
      const ext = createExt();
      const segment = createSegment(0x01);
      const result = ext.exportSegment(segment);

      assert.strictEqual(result.isOk, true);
      assert.strictEqual(result.ok, 0); // first export at offset 0
      assert.strictEqual(ext.getExportedSegments().length, 1);
    });

    it("should return sequential indices for multiple exports", () => {
      const ext = createExt();

      const r1 = ext.exportSegment(createSegment(0x01));
      const r2 = ext.exportSegment(createSegment(0x02));
      const r3 = ext.exportSegment(createSegment(0x03));

      assert.strictEqual(r1.isOk, true);
      assert.strictEqual(r1.ok, 0);
      assert.strictEqual(r2.isOk, true);
      assert.strictEqual(r2.ok, 1);
      assert.strictEqual(r3.isOk, true);
      assert.strictEqual(r3.ok, 2);
      assert.strictEqual(ext.getExportedSegments().length, 3);
    });

    it("should apply exportOffset to segment indices", () => {
      const ext = createExt({ exportOffset: 100 });
      const result = ext.exportSegment(createSegment());

      assert.strictEqual(result.isOk, true);
      assert.strictEqual(result.ok, 100);
    });

    it("should return SegmentExportError when MAX_NUMBER_OF_EXPORTS_WP exceeded", () => {
      const ext = createExt({ exportOffset: MAX_NUMBER_OF_EXPORTS_WP });
      const result = ext.exportSegment(createSegment());

      assert.strictEqual(result.isError, true);
      assert.strictEqual(result.error, SegmentExportError);
    });

    it("should return SegmentExportError at exactly MAX_NUMBER_OF_EXPORTS_WP - 1 + 1", () => {
      const ext = createExt({ exportOffset: MAX_NUMBER_OF_EXPORTS_WP - 1 });

      // This one should succeed (index = MAX_NUMBER_OF_EXPORTS_WP - 1)
      const r1 = ext.exportSegment(createSegment(0x01));
      assert.strictEqual(r1.isOk, true);
      assert.strictEqual(r1.ok, MAX_NUMBER_OF_EXPORTS_WP - 1);

      // This one should fail
```
