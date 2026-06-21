---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/authorizer/assembly/index.test.ts#L1-L65
title: examples/authorizer/assembly/index.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2d4f96bb273c5953c61857d62cb2c37a99518f50fa10f28a907f3adb5f2b27ba
language: typescript
---
`examples/authorizer/assembly/index.test.ts` (lines 1–65)

```typescript
import { BytesBlob, Encoder } from "@fluffylabs/as-lan";
import { Assert, Test, TestEcalli, TestFetch, test, unpackResult } from "@fluffylabs/as-lan/test";
import { is_authorized } from "./authorize";

/** Encode a u16 LE core index into a BytesBlob. */
function encodeCoreIndex(coreIndex: u16): BytesBlob {
  const buf = BytesBlob.zero(2);
  const enc = Encoder.into(buf.raw);
  enc.u16(coreIndex);
  return buf;
}

/** Call is_authorized with the given core index, returning the raw output bytes. */
function callAuthorize(coreIndex: u16): BytesBlob {
  const args = encodeCoreIndex(coreIndex);
  const result = is_authorized(args.ptr(), args.length);
  return BytesBlob.wrap(unpackResult(result));
}

/** Build the expected authorizer output: "Auth=<" + token + ">". */
function expectedOutput(token: BytesBlob): BytesBlob {
  const enc = Encoder.create();
  enc.bytesFixLen(BytesBlob.encodeAscii("Auth=<"));
  enc.bytesFixLen(token);
  enc.bytesFixLen(BytesBlob.encodeAscii(">"));
  return enc.finish();
}

export const TESTS: Test[] = [
  test("authorize succeeds when token matches config", () => {
    TestEcalli.reset();
    const token = BytesBlob.encodeAscii("hello");
    TestFetch.setDataForKind(8, token.raw);
    TestFetch.setDataForKind(9, token.raw);

    const result = callAuthorize(3);
    const a = Assert.create();
    a.isEqualBytes(result, expectedOutput(token), "auth output");
    return a;
  }),

  test("authorize succeeds with binary token", () => {
    TestEcalli.reset();
    const token = BytesBlob.parseBlob("0xdeadbeef").okay!;
    TestFetch.setDataForKind(8, token.raw);
    TestFetch.setDataForKind(9, token.raw);

    const result = callAuthorize(7);
    const a = Assert.create();
    a.isEqualBytes(result, expectedOutput(token), "auth output");
    return a;
  }),

  test("authorize succeeds with empty token", () => {
    TestEcalli.reset();
    const token = BytesBlob.empty();
    TestFetch.setDataForKind(8, token.raw);
    TestFetch.setDataForKind(9, token.raw);

    const result = callAuthorize(0);
    const a = Assert.create();
    a.isEqualBytes(result, expectedOutput(token), "auth output");
    return a;
  }),
];
```
