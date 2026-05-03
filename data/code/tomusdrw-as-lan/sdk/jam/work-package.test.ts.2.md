---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.test.ts#L205-L309
title: sdk/jam/work-package.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 2
chunk_total: 4
content_sha: ec856d135d8f9447fe4ddbacc5158b626b784f7f15c738cb948d26d20613ca37
language: typescript
---
`sdk/jam/work-package.test.ts` (lines 205–309)

```typescript
    const decoded = roundtrip<ImportRef>(original, _importRef, _importRef);

    const assert = Assert.create();
    assert.isEqualBytes(BytesBlob.wrap(decoded.hash.raw), BytesBlob.wrap(bytes32Fill(0xcc).raw), "hash");
    assert.isEqual(decoded.isWorkPackageHash, false, "isWorkPackageHash");
    assert.isEqual(decoded.index, 7, "index");
    return assert;
  }),

  test("ImportRef roundtrip work-package hash", () => {
    const original = ImportRef.create(bytes32Fill(0xdd), true, 0);
    const decoded = roundtrip<ImportRef>(original, _importRef, _importRef);

    const assert = Assert.create();
    assert.isEqual(decoded.isWorkPackageHash, true, "isWorkPackageHash");
    assert.isEqual(decoded.index, 0, "index zero");
    return assert;
  }),

  // ─── ExtrinsicRef ───

  test("ExtrinsicRef roundtrip", () => {
    const original = ExtrinsicRef.create(bytes32Fill(0xee), 4096);
    const decoded = roundtrip<ExtrinsicRef>(original, _extrinsicRef, _extrinsicRef);

    const assert = Assert.create();
    assert.isEqualBytes(BytesBlob.wrap(decoded.hash.raw), BytesBlob.wrap(bytes32Fill(0xee).raw), "hash");
    assert.isEqual(decoded.length, 4096, "length");
    return assert;
  }),

  // ─── WorkItem (full) ───

  test("WorkItem roundtrip with imports and extrinsics", () => {
    const imports = new StaticArray<ImportRef>(1);
    imports[0] = ImportRef.create(bytes32Fill(0x11), true, 3);
    const extrinsics = new StaticArray<ExtrinsicRef>(1);
    extrinsics[0] = ExtrinsicRef.create(bytes32Fill(0x22), 256);
    const payload = BytesBlob.parseBlob("0xcafe").okay!;

    const original = WorkItem.create(99, bytes32Fill(0xab), payload, 500000, 100000, 2, imports, extrinsics);
    const decoded = roundtrip<WorkItem>(original, _workItem, _workItem);

    const assert = Assert.create();
    assert.isEqual(decoded.serviceId, 99, "serviceId");
    assert.isEqualBytes(BytesBlob.wrap(decoded.codeHash.raw), BytesBlob.wrap(bytes32Fill(0xab).raw), "codeHash");
    assert.isEqualBytes(decoded.payload, payload, "payload");
    assert.isEqual(decoded.gasRefine, 500000, "gasRefine");
    assert.isEqual(decoded.gasAccumulate, 100000, "gasAccumulate");
    assert.isEqual(decoded.exportCount, 2, "exportCount");
    assert.isEqual(decoded.imports.length, 1, "import count");
    assert.isEqual(decoded.imports[0].isWorkPackageHash, true, "import[0].isWpHash");
    assert.isEqual(decoded.imports[0].index, 3, "import[0].index");
    assert.isEqual(decoded.extrinsics.length, 1, "extrinsic count");
    assert.isEqual(decoded.extrinsics[0].length, 256, "extrinsic[0].length");
    return assert;
  }),

  test("WorkItem roundtrip empty manifest", () => {
    const original = WorkItem.create(
      0,
      bytes32Fill(0x00),
      BytesBlob.empty(),
      0,
      0,
      0,
      new StaticArray<ImportRef>(0),
      new StaticArray<ExtrinsicRef>(0),
    );
    const decoded = roundtrip<WorkItem>(original, _workItem, _workItem);

    const assert = Assert.create();
    assert.isEqual(decoded.serviceId, 0, "serviceId zero");
    assert.isEqual(decoded.imports.length, 0, "no imports");
    assert.isEqual(decoded.extrinsics.length, 0, "no extrinsics");
    return assert;
  }),

  // ─── WorkPackage (full) ───

  test("WorkPackage roundtrip", () => {
    const ctx = RefinementContext.create(
      bytes32Fill(0x01),
      bytes32Fill(0x02),
      bytes32Fill(0x03),
      bytes32Fill(0x04),
      7777,
      new StaticArray<Bytes32>(0),
    );
    const item = WorkItem.create(
      42,
      bytes32Fill(0xab),
      BytesBlob.parseBlob("0xff").okay!,
      100000,
      50000,
      1,
      new StaticArray<ImportRef>(0),
      new StaticArray<ExtrinsicRef>(0),
    );
    const items = new StaticArray<WorkItem>(1);
    items[0] = item;

    const authToken = BytesBlob.parseBlob("0xaabbccdd").okay!;
    const authConfig = BytesBlob.parseBlob("0x1234").okay!;
    const original = WorkPackage.create(authToken, 10, bytes32Fill(0xcc), authConfig, ctx, items);
```
