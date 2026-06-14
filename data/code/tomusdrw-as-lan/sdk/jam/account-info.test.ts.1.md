---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/account-info.test.ts#L104-L215
title: sdk/jam/account-info.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 1
chunk_total: 3
content_sha: fc188acaafcccefec9d665ee05e2775b58aa303541c9bf890abe5f25e0339808
language: typescript
---
`sdk/jam/account-info.test.ts` (lines 104–215)

```typescript
    TestInfo.set(42, encodeInfoBytes(expected));

    const svc = ServiceData.create(42);
    const result = svc.info();
    a.isEqual(result.isSome, true, "should be some");
    const info = result.val!;
    a.isEqualBytes(info.codeHash.bytes, codeHash.bytes, "codeHash");
    a.isEqual(info.balance, 5000, "balance");
    a.isEqual(info.thresholdBalance, 2500, "thresholdBalance");
    a.isEqual(info.accumulateMinGas, 200_000, "accumulateMinGas");
    a.isEqual(info.onTransferMinGas, 100_000, "onTransferMinGas");
    a.isEqual(info.storageBytes, 4096, "storageBytes");
    a.isEqual(info.storageCount, 20, "storageCount");
    a.isEqual(info.gratisStorage, 2048, "gratisStorage");
    a.isEqual(info.createdSlot, 10, "createdSlot");
    a.isEqual(info.lastAccumulationSlot, 50, "lastAccumulationSlot");
    a.isEqual(info.parentService, 77, "parentService");
    return a;
  }),

  test("ServiceData.info returns None for missing service", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestInfo.setNone(999);

    const svc = ServiceData.create(999);
    const result = svc.info();
    a.isEqual(result.isSome, false, "should be none");
    return a;
  }),

  // ─── ServiceData.read() ───

  test("ServiceData.read returns value for existing key", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const val = BytesBlob.parseBlob("0xdeadbeef").okay!;
    TestStorage.set(strBlob("testkey"), val);

    const svc = ServiceData.create(42);
    const key = ByteBuf.create(32).strAscii("testkey").finishBlob();
    const result = svc.read(key);
    a.isEqual(result.isSome, true, "should be some");
    a.isEqualBytes(result.val!, val, "data");
    return a;
  }),

  test("ServiceData.read returns None for missing key", () => {
    TestEcalli.reset();
    const a = Assert.create();

    const svc = ServiceData.create(42);
    const key = ByteBuf.create(32).strAscii("nonexistent").finishBlob();
    const result = svc.read(key);
    a.isEqual(result.isSome, false, "should be none");
    return a;
  }),

  test("ServiceData.read auto-expands buffer for large values", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const largeVal = BytesBlob.zero(2048);
    for (let i = 0; i < 2048; i++) largeVal.raw[i] = u8(i & 0xff);
    TestStorage.set(strBlob("bigkey"), largeVal);

    // Create with small buffer (64 bytes) to force auto-expansion
    const svc = ServiceData.create(42, 64);
    const key = ByteBuf.create(32).strAscii("bigkey").finishBlob();
    const result = svc.read(key);
    a.isEqual(result.isSome, true, "should be some");
    a.isEqualBytes(result.val!, largeVal, "data");
    return a;
  }),

  // ─── CurrentServiceData.write() ───

  test("CurrentServiceData.write returns None for new key", () => {
    TestEcalli.reset();
    const a = Assert.create();

    const svc = CurrentServiceData.create();
    const key = ByteBuf.create(32).strAscii("newkey").finishBlob();
    const val = BytesBlob.parseBlob("0x010203").okay!;
    const result = svc.write(key, val);
    a.isEqual(result.isOkay, true, "should be ok");
    a.isEqual(result.okay!.isSome, false, "no previous value");
    return a;
  }),

  test("CurrentServiceData.write returns previous length on overwrite", () => {
    TestEcalli.reset();
    const a = Assert.create();

    const svc = CurrentServiceData.create();
    const key = ByteBuf.create(32).strAscii("overkey").finishBlob();
    const val1 = BytesBlob.zero(5);
    val1.raw.fill(0xaa);
    const val2 = BytesBlob.zero(3);
    val2.raw.fill(0xbb);

    // First write — no previous value
    svc.write(key, val1);

    // Second write — should return previous length (5)
    const key2 = ByteBuf.create(32).strAscii("overkey").finishBlob();
    const result = svc.write(key2, val2);
    a.isEqual(result.isOkay, true, "should be ok");
    a.isEqual(result.okay!.isSome, true, "has previous value");
    a.isEqual(result.okay!.val, 5, "previous length");
    return a;
  }),

```
