---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.test.ts#L112-L208
title: sdk/jam/work-package.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 4
content_sha: 7a93b4c8b5dc507ba3271458702d17e14efab679436c7e055d6e470d23eca3d0
language: typescript
---
`sdk/jam/work-package.test.ts` (lines 112–208)

```typescript
    assert.isEqual(decoded.validatorsCount, 1023, "V");
    assert.isEqual(decoded.maxAllocatedWorkPackageSize, 12582912, "W_A");
    assert.isEqual(decoded.maxEncodedWorkPackageSize, 4194304, "W_B");
    assert.isEqual(decoded.maxAuthorizerCodeSize, 65536, "W_C");
    assert.isEqual(decoded.erasureCodedPieceSize, 684, "W_E");
    assert.isEqual(decoded.maxImportSegments, 3072, "W_M");
    assert.isEqual(decoded.ecPiecesPerSegment, 6, "W_P");
    assert.isEqual(decoded.maxWorkReportSize, 48000, "W_R");
    assert.isEqual(decoded.transferMemoSize, 128, "W_T");
    assert.isEqual(decoded.maxExportSegments, 3072, "W_X");
    assert.isEqual(decoded.contestLength, 15, "Y");
    return assert;
  }),

  // ─── RefinementContext ───

  test("RefinementContext roundtrip with prerequisites", () => {
    const prereqs = new StaticArray<Bytes32>(2);
    prereqs[0] = bytes32Fill(0x11);
    prereqs[1] = bytes32Fill(0x22);
    const original = RefinementContext.create(
      bytes32Fill(0x01),
      bytes32Fill(0x02),
      bytes32Fill(0x03),
      bytes32Fill(0x04),
      12345,
      prereqs,
    );
    const decoded = roundtrip<RefinementContext>(original, _refinementCtx, _refinementCtx);

    const assert = Assert.create();
    assert.isEqualBytes(BytesBlob.wrap(decoded.anchor.raw), BytesBlob.wrap(bytes32Fill(0x01).raw), "anchor");
    assert.isEqualBytes(BytesBlob.wrap(decoded.stateRoot.raw), BytesBlob.wrap(bytes32Fill(0x02).raw), "stateRoot");
    assert.isEqualBytes(BytesBlob.wrap(decoded.beefyRoot.raw), BytesBlob.wrap(bytes32Fill(0x03).raw), "beefyRoot");
    assert.isEqualBytes(
      BytesBlob.wrap(decoded.lookupAnchor.raw),
      BytesBlob.wrap(bytes32Fill(0x04).raw),
      "lookupAnchor",
    );
    assert.isEqual(decoded.timeslot, 12345, "timeslot");
    assert.isEqual(decoded.prerequisites.length, 2, "prereq count");
    assert.isEqualBytes(
      BytesBlob.wrap(decoded.prerequisites[0].raw),
      BytesBlob.wrap(bytes32Fill(0x11).raw),
      "prereq[0]",
    );
    assert.isEqualBytes(
      BytesBlob.wrap(decoded.prerequisites[1].raw),
      BytesBlob.wrap(bytes32Fill(0x22).raw),
      "prereq[1]",
    );
    return assert;
  }),

  test("RefinementContext roundtrip no prerequisites", () => {
    const original = RefinementContext.create(
      bytes32Fill(0xff),
      bytes32Fill(0xee),
      bytes32Fill(0xdd),
      bytes32Fill(0xcc),
      0,
      new StaticArray<Bytes32>(0),
    );
    const decoded = roundtrip<RefinementContext>(original, _refinementCtx, _refinementCtx);

    const assert = Assert.create();
    assert.isEqual(decoded.timeslot, 0, "timeslot zero");
    assert.isEqual(decoded.prerequisites.length, 0, "no prereqs");
    return assert;
  }),

  // ─── WorkItemInfo (summary) ───

  test("WorkItemInfo roundtrip", () => {
    const original = WorkItemInfo.create(42, bytes32Fill(0xab), 100000, 50000, 3, 5, 2, 1024);
    const decoded = roundtrip<WorkItemInfo>(original, _workItemInfo, _workItemInfo);

    const assert = Assert.create();
    assert.isEqual(decoded.serviceId, 42, "serviceId");
    assert.isEqualBytes(BytesBlob.wrap(decoded.codeHash.raw), BytesBlob.wrap(bytes32Fill(0xab).raw), "codeHash");
    assert.isEqual(decoded.gasRefine, 100000, "gasRefine");
    assert.isEqual(decoded.gasAccumulate, 50000, "gasAccumulate");
    assert.isEqual(decoded.exportCount, 3, "exportCount");
    assert.isEqual(decoded.importCount, 5, "importCount");
    assert.isEqual(decoded.extrinsicCount, 2, "extrinsicCount");
    assert.isEqual(decoded.payloadLength, 1024, "payloadLength");
    return assert;
  }),

  // ─── ImportRef ───

  test("ImportRef roundtrip segment-root hash", () => {
    const original = ImportRef.create(bytes32Fill(0xcc), false, 7);
    const decoded = roundtrip<ImportRef>(original, _importRef, _importRef);

    const assert = Assert.create();
    assert.isEqualBytes(BytesBlob.wrap(decoded.hash.raw), BytesBlob.wrap(bytes32Fill(0xcc).raw), "hash");
```
