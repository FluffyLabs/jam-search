---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine-fetch.test.ts#L85-L173
title: packages/jam/in-core/externalities/refine-fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 8d2d539536bfdd34a762792f4e424d7931ae3a3b84d58d43a10ed689f5926655
language: typescript
---
`packages/jam/in-core/externalities/refine-fetch.test.ts` (lines 85–173)

```typescript
    extrinsics: opts.extrinsics ?? asKnownSize(items.map(() => [])),
    authorizerTrace: opts.authorizerTrace ?? BytesBlob.empty(),
  });
}

describe("RefineFetchExternalities", () => {
  it("should return different constants for different chain specs", () => {
    const tinyExt = prepareRefineData({ chainSpec: tinyChainSpec });
    const fullExt = prepareRefineData({ chainSpec: fullChainSpec });

    assert.notStrictEqual(tinyExt.constants().length, 0);
    assert.notStrictEqual(fullExt.constants().length, 0);
    assert.notDeepStrictEqual(tinyExt.constants(), fullExt.constants());
  });

  it("should return entropy H_0 (zero hash) per GP §B.3", () => {
    const ext = prepareRefineData();
    const entropy = ext.entropy();
    assert.strictEqual(entropy.length, HASH_SIZE);
    assert.ok(entropy.isEqualTo(Bytes.zero(HASH_SIZE).asOpaque()));
  });

  it("should return the supplied authorizer trace", () => {
    const trace = BytesBlob.blobFrom(new Uint8Array([0xaa, 0xbb, 0xcc]));
    const ext = prepareRefineData({ authorizerTrace: trace });
    assert.deepStrictEqual(ext.authorizerTrace().raw, trace.raw);
  });

  it("should return an extrinsic by work item index and extrinsic index", () => {
    const items = [buildWorkItem({}), buildWorkItem({ service: 2 })];
    const extrinsics: PerWorkItem<WorkItemExtrinsic[]> = asKnownSize([
      [asExtrinsic(BytesBlob.blobFrom(new Uint8Array([1])))],
      [
        asExtrinsic(BytesBlob.blobFrom(new Uint8Array([2, 2]))),
        asExtrinsic(BytesBlob.blobFrom(new Uint8Array([3, 3, 3]))),
      ],
    ]);
    const ext = prepareRefineData({ items, extrinsics });

    const other = ext.workItemExtrinsic(tryAsU64(1), tryAsU64(1));
    assert.ok(other !== null);
    assert.deepStrictEqual(other.raw, new Uint8Array([3, 3, 3]));
  });

  it("should return current item's extrinsic when workItem is null", () => {
    const items = [buildWorkItem({}), buildWorkItem({ service: 2 })];
    const extrinsics: PerWorkItem<WorkItemExtrinsic[]> = asKnownSize([
      [asExtrinsic(BytesBlob.blobFrom(new Uint8Array([9])))],
      [asExtrinsic(BytesBlob.blobFrom(new Uint8Array([8])))],
    ]);
    const ext = prepareRefineData({ items, extrinsics, currentWorkItemIndex: 1 });

    const mine = ext.workItemExtrinsic(null, tryAsU64(0));
    assert.ok(mine !== null);
    assert.deepStrictEqual(mine.raw, new Uint8Array([8]));
  });

  it("should return null for out-of-range extrinsic indices", () => {
    const items = [buildWorkItem({})];
    const extrinsics: PerWorkItem<WorkItemExtrinsic[]> = asKnownSize([
      [asExtrinsic(BytesBlob.blobFrom(new Uint8Array([1])))],
    ]);
    const ext = prepareRefineData({ items, extrinsics });

    assert.strictEqual(ext.workItemExtrinsic(tryAsU64(5), tryAsU64(0)), null);
    assert.strictEqual(ext.workItemExtrinsic(tryAsU64(0), tryAsU64(5)), null);
    assert.strictEqual(ext.workItemExtrinsic(null, tryAsU64(5)), null);
  });

  it("should treat U64 indices above the safe-integer range as out of range", () => {
    const items = [buildWorkItem({})];
    const ext = prepareRefineData({ items });
    const huge = tryAsU64(2n ** 53n); // first value > Number.MAX_SAFE_INTEGER
    assert.strictEqual(ext.workItemExtrinsic(huge, tryAsU64(0)), null);
    assert.strictEqual(ext.workItemExtrinsic(null, huge), null);
    assert.strictEqual(ext.workItemImport(huge, tryAsU64(0)), null);
    assert.strictEqual(ext.oneWorkItem(huge), null);
    assert.strictEqual(ext.workItemPayload(huge), null);
  });

  it("should return an import segment by work item index and segment index", () => {
    const items = [buildWorkItem({}), buildWorkItem({ service: 2 })];
    const segBytes = new Uint8Array(SEGMENT_BYTES).fill(0x55);
    const imports: PerWorkItem<ImportedSegment[]> = asKnownSize([
      [],
      [{ index: tryAsSegmentIndex(0), data: Bytes.fromBlob(segBytes, SEGMENT_BYTES) }],
    ]);
    const ext = prepareRefineData({ items, imports });

```
