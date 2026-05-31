---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine-fetch.test.ts#L168-L259
title: packages/jam/in-core/externalities/refine-fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 4
content_sha: a1291f31dc55da848162ada87c7417a23d06e804d4480bd481d21792e7d9c7f2
language: typescript
---
`packages/jam/in-core/externalities/refine-fetch.test.ts` (lines 168–259)

```typescript
    const imports: PerWorkItem<ImportedSegment[]> = asKnownSize([
      [],
      [{ index: tryAsSegmentIndex(0), data: Bytes.fromBlob(segBytes, SEGMENT_BYTES) }],
    ]);
    const ext = prepareRefineData({ items, imports });

    const imp = ext.workItemImport(tryAsU64(1), tryAsU64(0));
    assert.ok(imp !== null);
    assert.deepStrictEqual(imp.raw, segBytes);
  });

  it("should return null for out-of-range import indices", () => {
    const ext = prepareRefineData();
    assert.strictEqual(ext.workItemImport(tryAsU64(10), tryAsU64(0)), null);
    assert.strictEqual(ext.workItemImport(null, tryAsU64(10)), null);
    assert.strictEqual(ext.workItemImport(tryAsU64(0), tryAsU64(10)), null);
  });

  it("should return encoded work package", () => {
    const items = [buildWorkItem({})];
    const ext = prepareRefineData({ items });
    const expected = Encoder.encodeObject(WorkPackage.Codec, buildWorkPackage(items), tinyChainSpec);
    assert.deepStrictEqual(ext.workPackage().raw, expected.raw);
  });

  it("should return auth configuration and auth token from the package", () => {
    const ext = prepareRefineData();
    assert.deepStrictEqual(ext.authConfiguration().raw, new Uint8Array([4, 5, 6, 7]));
    assert.deepStrictEqual(ext.authToken().raw, new Uint8Array([1, 2, 3]));
  });

  it("should return encoded refine context", () => {
    const ext = prepareRefineData();
    const context = RefineContext.create({
      anchor: Bytes.fill(HASH_SIZE, 1).asOpaque(),
      stateRoot: Bytes.fill(HASH_SIZE, 2).asOpaque(),
      beefyRoot: Bytes.fill(HASH_SIZE, 3).asOpaque(),
      lookupAnchor: Bytes.fill(HASH_SIZE, 4).asOpaque(),
      lookupAnchorSlot: tryAsTimeSlot(16),
      prerequisites: [],
    });
    const expected = Encoder.encodeObject(RefineContext.Codec, context);
    assert.deepStrictEqual(ext.refineContext().raw, expected.raw);
  });

  it("should return concatenated work item summaries (kind 11) with 62 bytes per item", () => {
    const items = [
      buildWorkItem({ service: 1, payloadLen: 7, exportCount: 2, importCount: 1, extrinsicCount: 0 }),
      buildWorkItem({ service: 2, payloadLen: 4, exportCount: 0, importCount: 0, extrinsicCount: 3 }),
    ];
    const ext = prepareRefineData({ items });
    const all = ext.allWorkItems();
    assert.strictEqual(all.length, 62 * items.length);
  });

  it("should return a single work item summary (kind 12)", () => {
    const items = [buildWorkItem({ service: 1 }), buildWorkItem({ service: 2, payloadLen: 10 })];
    const ext = prepareRefineData({ items });

    const one = ext.oneWorkItem(tryAsU64(1));
    assert.ok(one !== null);
    assert.strictEqual(one.length, 62);

    // first 4 bytes are the service id (u32 LE).
    const serviceId = new DataView(one.raw.buffer, one.raw.byteOffset, 4).getUint32(0, true);
    assert.strictEqual(serviceId, 2);
    // payload length is the last 4 bytes (u32 LE).
    const payloadLen = new DataView(one.raw.buffer, one.raw.byteOffset + 58, 4).getUint32(0, true);
    assert.strictEqual(payloadLen, 10);
  });

  it("should return null for one work item when index is out of range", () => {
    const ext = prepareRefineData();
    assert.strictEqual(ext.oneWorkItem(tryAsU64(99)), null);
  });

  it("should return the raw payload of a work item (kind 13)", () => {
    const items = [buildWorkItem({ service: 1, payloadLen: 2 }), buildWorkItem({ service: 2, payloadLen: 5 })];
    const ext = prepareRefineData({ items });
    const payload = ext.workItemPayload(tryAsU64(1));
    assert.ok(payload !== null);
    assert.strictEqual(payload.length, 5);
    assert.ok(payload.raw.every((x: number) => x === 0xab));
  });

  it("should return null for payload when index is out of range", () => {
    const ext = prepareRefineData();
    assert.strictEqual(ext.workItemPayload(tryAsU64(99)), null);
  });

  // guard against silent accidental changes to the helpers — tryAsU32 ensures
  // encoded lengths match GP's S(w) spec.
```
