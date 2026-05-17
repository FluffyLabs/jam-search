---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/is-authorized-fetch.test.ts#L78-L115
title: packages/jam/in-core/externalities/is-authorized-fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: c94e7a105bddb4f2631753d8386d961ece79510d5e9d7218a159bf5d3e3dcba2
language: typescript
---
`packages/jam/in-core/externalities/is-authorized-fetch.test.ts` (lines 78–115)

```typescript
    assert.deepStrictEqual(ext.refineContext().raw, expected.raw);
  });

  it("returns concatenated work item summaries with 62 bytes per item", () => {
    const items = [buildWorkItem({ service: 1 }), buildWorkItem({ service: 2, payloadLen: 5 })];
    const ext = new IsAuthorizedFetchExternalities(tinyChainSpec, fetchDataFor(buildPackage(items)));
    assert.strictEqual(ext.allWorkItems().length, 62 * items.length);
  });

  it("returns a single work item summary (kind 12)", () => {
    const items = [buildWorkItem({ service: 1 }), buildWorkItem({ service: 2, payloadLen: 10 })];
    const ext = new IsAuthorizedFetchExternalities(tinyChainSpec, fetchDataFor(buildPackage(items)));
    const one = ext.oneWorkItem(tryAsU64(1));
    assert.ok(one !== null);
    assert.strictEqual(one.length, 62);
    const serviceId = new DataView(one.raw.buffer, one.raw.byteOffset, 4).getUint32(0, true);
    assert.strictEqual(serviceId, 2);
  });

  it("returns null for one work item when index is out of range", () => {
    const ext = new IsAuthorizedFetchExternalities(tinyChainSpec, fetchDataFor(buildPackage()));
    assert.strictEqual(ext.oneWorkItem(tryAsU64(99)), null);
  });

  it("returns the raw payload of a work item (kind 13)", () => {
    const items = [buildWorkItem({ service: 1, payloadLen: 2 }), buildWorkItem({ service: 2, payloadLen: 5 })];
    const ext = new IsAuthorizedFetchExternalities(tinyChainSpec, fetchDataFor(buildPackage(items)));
    const payload = ext.workItemPayload(tryAsU64(1));
    assert.ok(payload !== null);
    assert.strictEqual(payload.length, 5);
    assert.ok(payload.raw.every((x: number) => x === 0xab));
  });

  it("returns null for payload when index is out of range", () => {
    const ext = new IsAuthorizedFetchExternalities(tinyChainSpec, fetchDataFor(buildPackage()));
    assert.strictEqual(ext.workItemPayload(tryAsU64(99)), null);
  });
});
```
