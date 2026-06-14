---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/export.test.ts#L91-L114
title: packages/jam/jam-host-calls/refine/export.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: d16c7cc54b6cb2fdc53669f68e78ac5f4c4792a4a1c57f823d62ba4da3576ed4
language: typescript
---
`packages/jam/jam-host-calls/refine/export.test.ts` (lines 91–114)

```typescript
    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.strictEqual(refine.getExportedSegments().length, 0);
  });

  it("should fail with FULL if export limit is reached", async () => {
    const refine = new TestRefineExt();
    const exp = Export.new(refine);
    exp.currentServiceId = tryAsServiceId(10_000);
    const segment: Segment = Bytes.fill(SEGMENT_BYTES, 15).asOpaque();
    const { registers, memory } = prepareRegsAndMemory(segment);
    refine.exportSegmentData.set(
      Result.error(SegmentExportError, () => "Test: error occurred"),
      segment,
    );

    // when
    const result = await exp.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.FULL);
  });
});
```
