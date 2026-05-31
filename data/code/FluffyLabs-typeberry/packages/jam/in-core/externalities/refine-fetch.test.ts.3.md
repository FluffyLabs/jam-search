---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine-fetch.test.ts#L254-L270
title: packages/jam/in-core/externalities/refine-fetch.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 6633a4fbba13f06b0c9a699a263f7644e445640717f8437e18c4afe0dd9031dd
language: typescript
---
`packages/jam/in-core/externalities/refine-fetch.test.ts` (lines 254–270)

```typescript
    const ext = prepareRefineData();
    assert.strictEqual(ext.workItemPayload(tryAsU64(99)), null);
  });

  // guard against silent accidental changes to the helpers — tryAsU32 ensures
  // encoded lengths match GP's S(w) spec.
  it("uses unsigned little-endian u32 for payload length regardless of platform", () => {
    const items = [buildWorkItem({ service: 1, payloadLen: 0x1234 })];
    const ext = prepareRefineData({ items });
    const one = ext.oneWorkItem(tryAsU64(0));
    assert.ok(one !== null);
    const payloadLen = new DataView(one.raw.buffer, one.raw.byteOffset + 58, 4).getUint32(0, true);
    assert.strictEqual(payloadLen, 0x1234);
    // tryAsU32 would throw on negative values
    assert.doesNotThrow(() => tryAsU32(0x1234));
  });
});
```
