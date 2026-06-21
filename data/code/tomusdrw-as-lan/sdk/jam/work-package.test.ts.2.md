---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.test.ts#L202-L304
title: sdk/jam/work-package.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 4ed200cb6807a5a95a6edf07540d262cd48b861dd578474b25e51443bbfa614d
language: typescript
---
`sdk/jam/work-package.test.ts` (lines 202–304)

```typescript
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
    assert.isEqualBytes(decoded.hash.bytes, bytes32Fill(0xee).bytes, "hash");
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
    assert.isEqualBytes(decoded.codeHash.bytes, bytes32Fill(0xab).bytes, "codeHash");
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
    const decoded = roundtrip<WorkPackage>(original, _workPackage, _workPackage);

    const assert = Assert.create();
    assert.isEqualBytes(decoded.authToken, authToken, "authToken");
    assert.isEqual(decoded.authServiceId, 10, "authServiceId");
    assert.isEqualBytes(decoded.authCodeHash.bytes, bytes32Fill(0xcc).bytes, "authCodeHash");
    assert.isEqualBytes(decoded.authConfig, authConfig, "authConfig");
```
