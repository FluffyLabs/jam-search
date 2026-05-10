---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/externalities/refine.test.ts#L203-L312
title: packages/jam/in-core/externalities/refine.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 5
content_sha: f6011816a1c0f3fd24f27d507138fec5a070292c44f9c04eca5efac69220558a
language: typescript
---
`packages/jam/in-core/externalities/refine.test.ts` (lines 203–312)

```typescript
      // This one should succeed (index = MAX_NUMBER_OF_EXPORTS_WP - 1)
      const r1 = ext.exportSegment(createSegment(0x01));
      assert.strictEqual(r1.isOk, true);
      assert.strictEqual(r1.ok, MAX_NUMBER_OF_EXPORTS_WP - 1);

      // This one should fail
      const r2 = ext.exportSegment(createSegment(0x02));
      assert.strictEqual(r2.isError, true);
      assert.strictEqual(r2.error, SegmentExportError);
    });

    it("should store exact segment data", () => {
      const ext = createExt();
      const segment = createSmallSegment([1, 2, 3, 4, 5]);
      ext.exportSegment(segment);

      const exported = ext.getExportedSegments();
      assert.strictEqual(exported.length, 1);
      assert.deepStrictEqual(exported[0].raw.subarray(0, 5), new Uint8Array([1, 2, 3, 4, 5]));
    });
  });

  describe("machineInit", () => {
    it("should create a new inner PVM and return a machine ID", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const pc = tryAsProgramCounter(0);

      const result = await ext.machineInit(code, pc);

      assert.strictEqual(result.isOk, true);
      assert.strictEqual(result.ok, tryAsMachineId(0));
    });

    it("should assign sequential machine IDs", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const pc = tryAsProgramCounter(0);

      const r1 = await ext.machineInit(code, pc);
      const r2 = await ext.machineInit(code, pc);
      const r3 = await ext.machineInit(code, pc);

      assert.strictEqual(r1.isOk, true);
      assert.strictEqual(r1.ok, tryAsMachineId(0));
      assert.strictEqual(r2.isOk, true);
      assert.strictEqual(r2.ok, tryAsMachineId(1));
      assert.strictEqual(r3.isOk, true);
      assert.strictEqual(r3.ok, tryAsMachineId(2));
    });

    it("should return error for invalid program blob", async () => {
      const ext = createExt();
      const invalidCode = BytesBlob.blobFrom(new Uint8Array([0xff, 0xff, 0xff]));
      const pc = tryAsProgramCounter(0);

      const result = await ext.machineInit(invalidCode, pc);

      assert.strictEqual(result.isError, true);
    });

    it("should return error for empty program blob", async () => {
      const ext = createExt();
      const emptyCode = BytesBlob.blobFrom(new Uint8Array([]));
      const pc = tryAsProgramCounter(0);

      const result = await ext.machineInit(emptyCode, pc);

      assert.strictEqual(result.isError, true);
    });

    it("should accept a non-zero program counter", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const pc = tryAsProgramCounter(1);

      const result = await ext.machineInit(code, pc);
      assert.strictEqual(result.isOk, true);
    });
  });

  describe("machineExpunge", () => {
    it("should remove machine and return its program counter (0)", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const initResult = await ext.machineInit(code, tryAsProgramCounter(0));
      assert.strictEqual(initResult.isOk, true);

      const machineId = initResult.ok;
      const result = await ext.machineExpunge(machineId);

      assert.strictEqual(result.isOk, true);
      // PC should be 0 since we initialized with PC=0
      assert.strictEqual(result.ok, tryAsProgramCounter(0));
    });

    it("should remove machine and return its program counter (10)", async () => {
      const ext = createExt();
      const code = BytesBlob.blobFrom(MINIMAL_PROGRAM);
      const initResult = await ext.machineInit(code, tryAsProgramCounter(10));
      assert.strictEqual(initResult.isOk, true);

      const machineId = initResult.ok;
      const result = await ext.machineExpunge(machineId);

      assert.strictEqual(result.isOk, true);
      // PC should be 10 since we initialized with PC=10
      assert.strictEqual(result.ok, tryAsProgramCounter(10));
    });

```
