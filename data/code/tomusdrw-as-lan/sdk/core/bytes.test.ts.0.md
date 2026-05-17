---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/bytes.test.ts#L1-L51'
title: sdk/core/bytes.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 71737f631286b5f975a42dca7580dd9192e45594489d3ea0e82d1856a73f7c53
language: typescript
---
`sdk/core/bytes.test.ts` (lines 1–51)

```typescript
import { Assert, Test, test } from "../test/utils";
import { BlobParseError, BytesBlob } from "./bytes";

export const TESTS: Test[] = [
  test("bytes.toString", () => {
    // given
    const data = new Uint8Array(4);
    data[0] = 0xde;
    data[1] = 0xad;
    data[2] = 0xbe;
    data[3] = 0xef;

    // when
    const blob = BytesBlob.wrap(data);

    // then
    const assert = Assert.create();
    assert.isEqual(blob.toString(), "0xdeadbeef");
    return assert;
  }),
  test("bytes.fromString", () => {
    // when
    const res = BytesBlob.parseBlobNoPrefix("deadbeef");

    const assert = Assert.create();
    assert.isEqual(res.isOkay, true, "expected ok");
    const okay = res.okay;
    if (okay !== null) {
      assert.isEqual(okay.toString(), "0xdeadbeef");
    }
    return assert;
  }),
  test("bytes.fromString!len", () => {
    // when
    const res = BytesBlob.parseBlobNoPrefix("1");

    const assert = Assert.create();
    assert.isEqual(res.isError, true, "expected error");
    assert.isEqual(res.error, BlobParseError.InvalidNumberOfNibbles, "expected error");
    return assert;
  }),
  test("bytes.fromString!chars", () => {
    // when
    const res = BytesBlob.parseBlobNoPrefix("1234567890abcdefgh");

    const assert = Assert.create();
    assert.isEqual(res.isError, true, "should be error");
    assert.isEqual(res.error, BlobParseError.InvalidCharacters, "expected error");
    return assert;
  }),
];
```
