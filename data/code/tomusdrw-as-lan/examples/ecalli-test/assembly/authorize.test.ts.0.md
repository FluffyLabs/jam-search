---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/authorize.test.ts#L1-L117
title: examples/ecalli-test/assembly/authorize.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 4cbf47da107c6dc6fc2064f7e9260628e5ad8eddcb0377be78784140ea6214ca
language: typescript
---
`examples/ecalli-test/assembly/authorize.test.ts` (lines 1–117)

```typescript
import { BytesBlob, Decoder, Encoder, RefineContext, Response } from "@fluffylabs/as-lan";
import { Assert, Test, TestEcalli, TestFetch, test, unpackResult } from "@fluffylabs/as-lan/test";
import { is_authorized } from "./authorize";
import { EcalliIndex } from "./ecalli-index";
import { strBlob } from "./test-helpers";

/** Encode a u16 LE core index into a BytesBlob. */
function encodeCoreIndex(coreIndex: u16): BytesBlob {
  const buf = BytesBlob.zero(2);
  const enc = Encoder.into(buf.raw);
  enc.u16(coreIndex);
  return buf;
}

/** Call is_authorized with ecalli payload in authConfig. */
function callAuthorize(payload: Uint8Array): Response {
  TestFetch.setDataForKind(8, payload);
  TestFetch.setDataForKind(9, new Uint8Array(0));

  const args = encodeCoreIndex(0);
  const raw = unpackResult(is_authorized(args.ptr(), args.length));
  const ctx = RefineContext.create();
  return ctx.response.decode(Decoder.fromBlob(raw)).okay!;
}

export const TESTS: Test[] = [
  test("authorize: gas returns remaining gas", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Gas);

    const resp = callAuthorize(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 1000000, "gas result");
    assert.isEqual(resp.data.raw.length, 0, "no output data");
    return assert;
  }),

  test("authorize: fetch work package data", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Fetch);
    p.varU64(7); // kind: WorkPackage
    p.varU64(0); // param1
    p.varU64(0); // param2
    p.varU64(0); // offset
    p.varU64(32); // maxLen

    const resp = callAuthorize(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 16, "fetch total length");
    assert.isEqual(resp.data.raw.length, 16, "fetched data length");
    return assert;
  }),

  test("authorize: lookup preimage by hash", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Lookup);
    p.varU64(u64(u32.MAX_VALUE)); // service: current
    p.bytesFixLen(BytesBlob.zero(32)); // hash: zeros
    p.varU64(0); // offset
    p.varU64(256); // maxLen

    const resp = callAuthorize(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 13, "lookup total length");
    assert.isEqual(resp.data.raw.length, 13, "preimage data length");
    return assert;
  }),

  test("authorize: read returns NONE for missing key", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Read);
    p.varU64(u64(u32.MAX_VALUE)); // service: current
    p.bytesVarLen(strBlob("missing-auth")); // key
    p.varU64(0); // offset
    p.varU64(8); // maxLen

    const resp = callAuthorize(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, -1, "read returns NONE");
    assert.isEqual(resp.data.raw.length, 0, "no data for missing key");
    return assert;
  }),

  test("authorize: write stores value", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Write);
    p.bytesVarLen(strBlob("auth-key")); // key
    const val = BytesBlob.parseBlob("0xdeadbeef").okay!;
    p.bytesVarLen(val); // value

    const resp = callAuthorize(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, -1, "write returns NONE (no previous value)");
    return assert;
  }),

  test("authorize: info returns 96-byte service info", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Info);
    p.varU64(u64(u32.MAX_VALUE)); // service: current
    p.varU64(0); // offset
    p.varU64(96); // maxLen

    const resp = callAuthorize(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 96, "info total length");
    assert.isEqual(resp.data.raw.length, 96, "info data length");
    return assert;
  }),

  test("authorize: log emits debug message", () => {
```
