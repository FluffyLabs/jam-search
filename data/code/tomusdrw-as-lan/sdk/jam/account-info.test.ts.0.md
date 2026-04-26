---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/account-info.test.ts#L1-L108
title: sdk/jam/account-info.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 3
content_sha: 1f930740eef3837285a8473e853e6e9a11570f0ffbd9cf5bb6027274c3d59d2c
language: typescript
---
`sdk/jam/account-info.test.ts` (lines 1–108)

```typescript
import { ByteBuf } from "../core/byte-buf";
import { Bytes32, BytesBlob } from "../core/bytes";
import { Decoder } from "../core/codec/decode";
import { Encoder } from "../core/codec/encode";
import { TestEcalli, TestInfo, TestStorage } from "../test/test-ecalli";
import { Assert, strBlob, Test, test } from "../test/utils";
import { ACCOUNT_INFO_SIZE, AccountInfo, AccountInfoCodec } from "./account-info";
import { CurrentServiceData, ServiceData } from "./service-data";

const _codec: AccountInfoCodec = AccountInfoCodec.create();

function bytes32Fill(v: u8): Bytes32 {
  const buf = BytesBlob.zero(32);
  buf.raw.fill(v);
  return Bytes32.wrapUnchecked(buf.raw);
}

function roundtrip(original: AccountInfo): AccountInfo {
  const e = Encoder.create();
  _codec.encode(original, e);
  const d = Decoder.fromBlob(e.finishRaw());
  const r = _codec.decode(d);
  assert(r.isOkay, "roundtrip decode failed");
  assert(d.isFinished(), "trailing bytes after decode");
  return r.okay!;
}

function encodeInfoBytes(info: AccountInfo): Uint8Array {
  const e = Encoder.create();
  _codec.encode(info, e);
  return e.finishRaw();
}

export const TESTS: Test[] = [
  // ─── AccountInfoCodec ───

  test("AccountInfo roundtrip", () => {
    const a = Assert.create();
    const original = AccountInfo.create(bytes32Fill(0xab), 1000, 500, 100_000, 50_000, 2048, 10, 1024, 7, 42, 99);
    const decoded = roundtrip(original);
    a.isEqual(decoded.codeHash.raw[0], 0xab, "codeHash[0]");
    a.isEqual(decoded.codeHash.raw[31], 0xab, "codeHash[31]");
    a.isEqual(decoded.balance, 1000, "balance");
    a.isEqual(decoded.thresholdBalance, 500, "thresholdBalance");
    a.isEqual(decoded.accumulateMinGas, 100_000, "accumulateMinGas");
    a.isEqual(decoded.onTransferMinGas, 50_000, "onTransferMinGas");
    a.isEqual(decoded.storageBytes, 2048, "storageBytes");
    a.isEqual(decoded.storageCount, 10, "storageCount");
    a.isEqual(decoded.gratisStorage, 1024, "gratisStorage");
    a.isEqual(decoded.createdSlot, 7, "createdSlot");
    a.isEqual(decoded.lastAccumulationSlot, 42, "lastAccumulationSlot");
    a.isEqual(decoded.parentService, 99, "parentService");
    return a;
  }),

  test("AccountInfo encoded size is 96 bytes", () => {
    const a = Assert.create();
    const original = AccountInfo.create(bytes32Fill(0x00), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const e = Encoder.create();
    _codec.encode(original, e);
    const bytes = e.finishRaw();
    a.isEqual(bytes.length, <i32>ACCOUNT_INFO_SIZE, "encoded size");
    return a;
  }),

  test("AccountInfo roundtrip with max values", () => {
    const a = Assert.create();
    const original = AccountInfo.create(
      bytes32Fill(0xff),
      u64.MAX_VALUE,
      u64.MAX_VALUE,
      u64.MAX_VALUE,
      u64.MAX_VALUE,
      u64.MAX_VALUE,
      u32.MAX_VALUE,
      u64.MAX_VALUE,
      u32.MAX_VALUE,
      u32.MAX_VALUE,
      u32.MAX_VALUE,
    );
    const decoded = roundtrip(original);
    a.isEqual(decoded.balance, u64.MAX_VALUE, "balance max");
    a.isEqual(decoded.storageCount, u32.MAX_VALUE, "storageCount max");
    a.isEqual(decoded.parentService, u32.MAX_VALUE, "parentService max");
    return a;
  }),

  test("AccountInfo decode rejects truncated input", () => {
    const a = Assert.create();
    const truncated = BytesBlob.zero(50);
    const d = Decoder.fromBytesBlob(truncated);
    const r = _codec.decode(d);
    a.isEqual(r.isError, true, "should fail on truncated input");
    return a;
  }),

  // ─── ServiceData.info() ───

  test("ServiceData.info returns AccountInfo", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const expected = AccountInfo.create(bytes32Fill(0xcc), 5000, 2500, 200_000, 100_000, 4096, 20, 2048, 10, 50, 77);
    TestInfo.set(42, encodeInfoBytes(expected));

    const svc = ServiceData.create(42);
    const result = svc.info();
    a.isEqual(result.isSome, true, "should be some");
    const info = result.val!;
```
