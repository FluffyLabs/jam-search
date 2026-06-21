---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/service.test.ts#L1-L104'
title: sdk/jam/service.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: cafed645a27f9a71029ca4eaf37d59d94a9676ee73e6e905ccf256800f270fab
language: typescript
---
`sdk/jam/service.test.ts` (lines 1–104)

```typescript
import { Bytes32, BytesBlob } from "../core/bytes";
import { Decoder } from "../core/codec/decode";
import { Encoder } from "../core/codec/encode";
import { Assert, Test, test, unpackResult } from "../test/utils";
import { AccumulateContext } from "./accumulate/context";
import { RefineContext } from "./refine/context";
import { AccumulateArgs, RefineArgs, Response } from "./service";

/** Helper: create a Bytes32 filled with a repeating byte. */
function bytes32Fill(v: u8): Bytes32 {
  const buf = BytesBlob.zero(32);
  buf.raw.fill(v);
  return Bytes32.wrapUnchecked(buf.raw);
}

// Test-only: contexts created at module scope for convenience.
const rCtx: RefineContext = RefineContext.create();
const aCtx: AccumulateContext = AccumulateContext.create();

export const TESTS: Test[] = [
  // ─── RefineArgs ───

  test("RefineArgs roundtrip", () => {
    const payload = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const hash = bytes32Fill(0xab);
    const original = RefineArgs.create(5, 10, 42, payload, hash);

    const e = Encoder.create();
    rCtx.refineArgs.encode(original, e);
    const blob = e.finish();
    const parsed = rCtx.parseArgs(blob.ptr(), blob.length);

    const assert = Assert.create();
    assert.isEqual(parsed.coreIndex, 5, "coreIndex");
    assert.isEqual(parsed.itemIndex, 10, "itemIndex");
    assert.isEqual(parsed.serviceId, 42, "serviceId");
    assert.isEqualBytes(parsed.payload, payload, "payload");
    assert.isEqualBytes(BytesBlob.wrap(parsed.workPackageHash.raw), BytesBlob.wrap(hash.raw), "workPackageHash");
    return assert;
  }),

  test("RefineArgs roundtrip with empty payload", () => {
    const hash = bytes32Fill(0x00);
    const original = RefineArgs.create(0, 0, 0, BytesBlob.empty(), hash);

    const e = Encoder.create();
    rCtx.refineArgs.encode(original, e);
    const blob = e.finish();
    const parsed = rCtx.parseArgs(blob.ptr(), blob.length);

    const assert = Assert.create();
    assert.isEqual(parsed.coreIndex, 0, "coreIndex");
    assert.isEqual(parsed.itemIndex, 0, "itemIndex");
    assert.isEqual(parsed.serviceId, 0, "serviceId");
    assert.isEqualBytes(parsed.payload, BytesBlob.empty(), "empty payload");
    assert.isEqualBytes(BytesBlob.wrap(parsed.workPackageHash.raw), BytesBlob.wrap(hash.raw), "zero hash");
    return assert;
  }),

  test("RefineArgs roundtrip with max values", () => {
    const payload = BytesBlob.parseBlob("0xff").okay!;
    const hash = bytes32Fill(0xff);
    const original = RefineArgs.create(0xffff, 0xffffffff, 0xffffffff, payload, hash);

    const e = Encoder.create();
    rCtx.refineArgs.encode(original, e);
    const blob = e.finish();
    const parsed = rCtx.parseArgs(blob.ptr(), blob.length);

    const assert = Assert.create();
    assert.isEqual(parsed.coreIndex, 0xffff, "coreIndex max");
    assert.isEqual(parsed.itemIndex, 0xffffffff, "itemIndex max");
    assert.isEqual(parsed.serviceId, 0xffffffff, "serviceId max");
    assert.isEqualBytes(parsed.payload, payload, "payload");
    assert.isEqualBytes(BytesBlob.wrap(parsed.workPackageHash.raw), BytesBlob.wrap(hash.raw), "hash all ff");
    return assert;
  }),

  // ─── AccumulateArgs ───

  test("AccumulateArgs roundtrip", () => {
    const original = AccumulateArgs.create(12345, 678, 3);

    const e = Encoder.create();
    aCtx.accumulateArgs.encode(original, e);
    const blob = e.finish();
    const parsed = aCtx.parseArgs(blob.ptr(), blob.length);

    const assert = Assert.create();
    assert.isEqual(parsed.slot, 12345, "slot");
    assert.isEqual(parsed.serviceId, 678, "serviceId");
    assert.isEqual(parsed.argsLength, 3, "argsLength");
    return assert;
  }),

  test("AccumulateArgs roundtrip zero values", () => {
    const original = AccumulateArgs.create(0, 0, 0);

    const e = Encoder.create();
    aCtx.accumulateArgs.encode(original, e);
    const blob = e.finish();
    const parsed = aCtx.parseArgs(blob.ptr(), blob.length);

    const assert = Assert.create();
```
