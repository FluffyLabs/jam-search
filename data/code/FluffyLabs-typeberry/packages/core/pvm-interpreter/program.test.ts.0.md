---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/program.test.ts#L1-L17
title: packages/core/pvm-interpreter/program.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 68945b4c98cc0bbd37bac7c75f20cac7f79ef03f470079fa2fdfdc6c590635f6
language: typescript
---
`packages/core/pvm-interpreter/program.test.ts` (lines 1–17)

```typescript
import { describe, it } from "node:test";
import { BytesBlob } from "@typeberry/bytes";

import { deepEqual } from "@typeberry/utils/test.js";
import { extractCodeAndMetadata } from "./program.js";
import { CODE, METADATA, PREIMAGE_TEST_BLOB } from "./test-preimage-blob.js";

describe("extractCodeAndMetadata", () => {
  it("should correctly decode code with metadata", () => {
    const blobWithMetadata = BytesBlob.parseBlobNoPrefix(PREIMAGE_TEST_BLOB).raw;

    const { code, metadata } = extractCodeAndMetadata(blobWithMetadata);

    deepEqual(BytesBlob.blobFrom(code), BytesBlob.parseBlobNoPrefix(CODE));
    deepEqual(BytesBlob.blobFrom(metadata), BytesBlob.parseBlobNoPrefix(METADATA));
  });
});
```
