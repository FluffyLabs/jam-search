---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/codec/work-package.ts#L1-L44
title: bin/test-runner/w3f/codec/work-package.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 45cda0a70f1b87d04e2b3d0d8b011c6f3604b646632f13c245b63af70d0af602
language: typescript
---
`bin/test-runner/w3f/codec/work-package.ts` (lines 1–44)

```typescript
import type { CodeHash, ServiceId } from "@typeberry/block";
import type { RefineContext } from "@typeberry/block/refine-context.js";
import type { WorkItem } from "@typeberry/block/work-item.js";
import { tryAsWorkItemsCount, WorkPackage } from "@typeberry/block/work-package.js";
import { fromJson, refineContextFromJson } from "@typeberry/block-json";
import { BytesBlob } from "@typeberry/bytes";
import { FixedSizeArray } from "@typeberry/collections";
import { json } from "@typeberry/json-parser";
import type { RunOptions } from "../../common.js";
import { runCodecTest } from "./common.js";
import { workItemFromJson } from "./work-item.js";

export const workPackageFromJson = json.object<JsonWorkPackage, WorkPackage>(
  {
    authorization: json.fromString(BytesBlob.parseBlob),
    auth_code_host: "number",
    auth_code_hash: fromJson.bytes32(),
    authorizer_config: json.fromString(BytesBlob.parseBlob),
    context: refineContextFromJson,
    items: json.array(workItemFromJson),
  },
  ({ authorization, auth_code_host, auth_code_hash, authorizer_config, context, items }) =>
    WorkPackage.create({
      authToken: authorization,
      authCodeHost: auth_code_host,
      authCodeHash: auth_code_hash,
      authConfiguration: authorizer_config,
      context,
      items: FixedSizeArray.new(items, tryAsWorkItemsCount(items.length)),
    }),
);

type JsonWorkPackage = {
  authorization: BytesBlob;
  auth_code_host: ServiceId;
  auth_code_hash: CodeHash;
  authorizer_config: BytesBlob;
  context: RefineContext;
  items: WorkItem[];
};

export async function runWorkPackageTest(test: WorkPackage, { path: file }: RunOptions) {
  runCodecTest(WorkPackage.Codec, test, file);
}
```
