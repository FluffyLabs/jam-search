---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.test.ts#L112-L205
title: sdk/jam/work-package.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 4
content_sha: c032d9ba3b9cd6c2cf8dcf201b585af87194ef3473a336a0eaf3781ca5840510
language: typescript
---
`sdk/jam/work-package.test.ts` (lines 112–205)

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
    assert.isEqualBytes(decoded.anchor.bytes, bytes32Fill(0x01).bytes, "anchor");
    assert.isEqualBytes(decoded.stateRoot.bytes, bytes32Fill(0x02).bytes, "stateRoot");
    assert.isEqualBytes(decoded.beefyRoot.bytes, bytes32Fill(0x03).bytes, "beefyRoot");
    assert.isEqualBytes(decoded.lookupAnchor.bytes, bytes32Fill(0x04).bytes, "lookupAnchor");
    assert.isEqual(decoded.timeslot, 12345, "timeslot");
    assert.isEqual(decoded.prerequisites.length, 2, "prereq count");
    assert.isEqualBytes(decoded.prerequisites[0].bytes, bytes32Fill(0x11).bytes, "prereq[0]");
    assert.isEqualBytes(decoded.prerequisites[1].bytes, bytes32Fill(0x22).bytes, "prereq[1]");
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
    assert.isEqualBytes(decoded.codeHash.bytes, bytes32Fill(0xab).bytes, "codeHash");
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
    assert.isEqualBytes(decoded.hash.bytes, bytes32Fill(0xcc).bytes, "hash");
    assert.isEqual(decoded.isWorkPackageHash, false, "isWorkPackageHash");
    assert.isEqual(decoded.index, 7, "index");
    return assert;
  }),

  test("ImportRef roundtrip work-package hash", () => {
    const original = ImportRef.create(bytes32Fill(0xdd), true, 0);
    const decoded = roundtrip<ImportRef>(original, _importRef, _importRef);

```
