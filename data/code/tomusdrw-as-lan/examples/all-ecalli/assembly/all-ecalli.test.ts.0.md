---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/assembly/all-ecalli.test.ts#L1-L116
title: examples/all-ecalli/assembly/all-ecalli.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e3aabe5627a055c2e9c868a12f01e50f51827334831296377d23b0051e432243
language: typescript
---
`examples/all-ecalli/assembly/all-ecalli.test.ts` (lines 1–116)

```typescript
import {
  AccumulateArgs,
  AccumulateContext,
  Bytes32,
  BytesBlob,
  Decoder,
  Encoder,
  RefineArgs,
  RefineContext,
  Response,
} from "@fluffylabs/as-lan";
import { Assert, Test, TestEcalli, test, unpackResult } from "@fluffylabs/as-lan/test";
import { accumulate } from "./accumulate";
import { AUTHORIZE_ECALLI_COUNT } from "./authorize";
import { refine } from "./index";

/** Expected number of ecalli calls by refine (general 0-5,100 + fetch kinds 0-13 + refine 6-13). */
const REFINE_ECALLI_COUNT: u32 = 28;
/** Expected number of ecalli calls by accumulate (general 0-5,100 + fetch kinds 0,1,14,15 + accumulate 14-26). */
const ACCUMULATE_ECALLI_COUNT: u32 = 23;

function callRefine(): Response {
  const ctx = RefineContext.create();
  const args = RefineArgs.create(0, 0, 42, BytesBlob.empty(), Bytes32.zero());
  const enc = Encoder.create();
  ctx.refineArgs.encode(args, enc);
  const blob = enc.finish();
  const raw = unpackResult(refine(blob.ptr(), blob.length));
  return ctx.response.decode(Decoder.fromBlob(raw)).okay!;
}

function callAccumulate(): Response {
  const ctx = AccumulateContext.create();
  const args = AccumulateArgs.create(7, 42, 0);
  const enc = Encoder.create();
  ctx.accumulateArgs.encode(args, enc);
  const blob = enc.finish();
  const raw = unpackResult(accumulate(blob.ptr(), blob.length));
  return ctx.response.decode(Decoder.fromBlob(raw)).okay!;
}

/** Call is_authorized via refine dispatch (len==2), returning raw trace bytes. */
function callAuthorize(): Uint8Array {
  TestEcalli.reset();
  const buf = BytesBlob.zero(2);
  const enc = Encoder.into(buf.raw);
  enc.u16(0); // core index
  return unpackResult(refine(buf.ptr(), buf.length));
}

export const TESTS: Test[] = [
  test("refine: invokes all general + refine ecallis", () => {
    const resp = callRefine();
    const assert = Assert.create();
    assert.isEqual(resp.result, i64(REFINE_ECALLI_COUNT), "refine ecalli count");

    // Decode the count from the data
    const d = Decoder.fromBytesBlob(resp.data);
    const count = d.varU32();
    assert.isEqual(count, REFINE_ECALLI_COUNT, "encoded count matches");

    // Verify we can decode all result pairs (ecalli_index + u64 result)
    for (let i: u32 = 0; i < count; i++) {
      const idx = d.varU64();
      const _result = d.u64();
      if (d.isError) {
        assert.fail(`failed to decode result pair at index ${i} (ecalli ${idx})`);
        break;
      }
    }
    return assert;
  }),

  test("authorize: invokes all general + authorize-context ecallis", () => {
    const raw = callAuthorize();
    const assert = Assert.create();

    // Decode the count from the trace
    const d = Decoder.fromBlob(raw);
    const count = d.varU32();
    assert.isEqual(count, AUTHORIZE_ECALLI_COUNT, "authorize ecalli count");

    // Verify we can decode all result pairs (ecalli_index + u64 result)
    for (let i: u32 = 0; i < count; i++) {
      const idx = d.varU64();
      const _result = d.u64();
      if (d.isError) {
        assert.fail(`failed to decode result pair at index ${i} (ecalli ${idx})`);
        break;
      }
    }
    return assert;
  }),

  test("accumulate: invokes all general + accumulate ecallis", () => {
    const resp = callAccumulate();
    const assert = Assert.create();
    assert.isEqual(resp.result, i64(ACCUMULATE_ECALLI_COUNT), "accumulate ecalli count");

    // Decode the count from the data
    const d = Decoder.fromBytesBlob(resp.data);
    const count = d.varU32();
    assert.isEqual(count, ACCUMULATE_ECALLI_COUNT, "encoded count matches");

    // Verify we can decode all result pairs (ecalli_index + u64 result)
    for (let i: u32 = 0; i < count; i++) {
      const idx = d.varU64();
      const _result = d.u64();
      if (d.isError) {
        assert.fail(`failed to decode result pair at index ${i} (ecalli ${idx})`);
        break;
      }
    }
    return assert;
  }),
];
```
