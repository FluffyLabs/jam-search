---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/crypto/blake2b.test.ts#L1-L38
title: sdk/core/crypto/blake2b.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 67f9d015455398256d92029718809d5661d143763f7ab284b02a5c1519172337
language: typescript
---
`sdk/core/crypto/blake2b.test.ts` (lines 1–38)

```typescript
import { Assert, Test, test } from "../../test/utils";
import { BytesBlob } from "../bytes";
import { blake2b256 } from "./blake2b";

function fromHex(hex: string): BytesBlob {
  return BytesBlob.parseBlob(hex).okay!;
}

export const TESTS: Test[] = [
  // Verified via: python3 -c "import hashlib; print(hashlib.blake2b(b'...', digest_size=32).hexdigest())"
  test("blake2b256 empty input", () => {
    const got = BytesBlob.wrap(blake2b256(new Uint8Array(0)));
    const exp = fromHex("0x0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8");
    const assert = Assert.create();
    assert.isEqualBytes(got, exp, "hash");
    return assert;
  }),
  test("blake2b256 'abc'", () => {
    const input = new Uint8Array(3);
    input[0] = 0x61;
    input[1] = 0x62;
    input[2] = 0x63;
    const got = BytesBlob.wrap(blake2b256(input));
    const exp = fromHex("0xbddd813c634239723171ef3fee98579b94964e3bb1cb3e427262c8c068d52319");
    const assert = Assert.create();
    assert.isEqualBytes(got, exp, "hash");
    return assert;
  }),
  test("blake2b256 144 bytes of 0xaa — exceeds single block", () => {
    const input = new Uint8Array(144);
    for (let i = 0; i < 144; i += 1) input[i] = 0xaa;
    const got = BytesBlob.wrap(blake2b256(input));
    const exp = fromHex("0x59ccfbdaa43eae776228a5ac904618eab144ed32596bc60ce66a27d44110ef9b");
    const assert = Assert.create();
    assert.isEqualBytes(got, exp, "hash");
    return assert;
  }),
];
```
