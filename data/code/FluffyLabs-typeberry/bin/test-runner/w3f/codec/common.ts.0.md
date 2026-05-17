---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/codec/common.ts#L1-L27
title: bin/test-runner/w3f/codec/common.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 9a703fcef892944d22baeb1818d49eec0231f626d2cd42f37d8c2491c4deedba
language: typescript
---
`bin/test-runner/w3f/codec/common.ts` (lines 1–27)

```typescript
import assert from "node:assert";
import fs from "node:fs";
import { BytesBlob } from "@typeberry/bytes";
import { type Codec, Decoder, Encoder } from "@typeberry/codec";
import { fullChainSpec, tinyChainSpec } from "@typeberry/config";

export function runCodecTest<T>(codec: Codec<T>, test: T, file: string) {
  const spec = getChainSpec(file);
  const encoded = new Uint8Array(fs.readFileSync(file.replace("json", "bin")));
  const myEncoded = Encoder.encodeObject(codec, test, spec);
  assert.deepStrictEqual(myEncoded.toString(), BytesBlob.blobFrom(encoded).toString());

  const decoded = Decoder.decodeObject(codec, BytesBlob.blobFrom(encoded), spec);
  assert.deepStrictEqual(decoded, test);
}

function getChainSpec(file: string) {
  if (file.includes("/tiny/")) {
    return tinyChainSpec;
  }

  if (file.includes("/full/")) {
    return fullChainSpec;
  }

  throw new Error(`Cannot match a chain spec for: ${file}`);
}
```
