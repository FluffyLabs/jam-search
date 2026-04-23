---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/utilities.md#L96-L110
title: docs/src/sdk-api/utilities.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 1
chunk_total: 2
content_sha: 91e01a0809c1daa94e10f8ea2925ea5fc9a464c615a5b71b64aaf34963a68663
language: markdown
---
`docs/src/sdk-api/utilities.md` (lines 96–110)

```markdown
```typescript
import { Decoder } from "@fluffylabs/as-lan";

const decoder = Decoder.fromBlob(data);
const value = decoder.varU64();
const hash = decoder.bytes32();
const blob = decoder.bytesVarLen();
```

Key methods: `u8`, `u16`, `u32`, `u64`, `varU32`, `varU64`, `bytes32`, `bytesFixLen`, `bytesVarLen`, `object`, `optional`, `sequenceFixLen`, `sequenceVarLen`, `skip`, `isFinished`, `isError`.

## Byte Types

- **`Bytes32`** — Fixed-size 32-byte array with hex string parsing and `.ptr()` for raw pointer access
- **`BytesBlob`** — Variable-length byte array wrapper with `.toPtrAndLen()` for returning results and `.ptr()` for raw pointer access. Factory methods: `BytesBlob.wrap(data)`, `BytesBlob.encodeAscii(str)`, `BytesBlob.encodeUtf8(str)`, `BytesBlob.zero(len)`, `BytesBlob.empty()`
```
