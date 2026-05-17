---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.test.ts#L1-L30
title: packages/jam/node/main-fuzz.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 65d303f6affca41b37ce66638165bc2093730b123b3fcd647d4d0f8e7204f3a0
language: typescript
---
`packages/jam/node/main-fuzz.test.ts` (lines 1–30)

```typescript
import { describe, it } from "node:test";
import { tryAsU8 } from "@typeberry/numbers";
import { CURRENT_VERSION, deepEqual, version } from "@typeberry/utils";
import { getFuzzDetails } from "./main-fuzz.js";

describe("fuzzing config", () => {
  it("should create config from current version", () => {
    const [m, i, p] = version.split(".").map((x) => Number.parseInt(x, 10));
    const [gpM, gpI, gpP] = CURRENT_VERSION.split(".").map((x) => Number.parseInt(x, 10));

    const fuzzDetails = getFuzzDetails();
    deepEqual(
      fuzzDetails,
      {
        nodeName: "@typeberry/jam",
        nodeVersion: {
          major: tryAsU8(m),
          minor: tryAsU8(i),
          patch: tryAsU8(p),
        },
        gpVersion: {
          major: tryAsU8(gpM),
          minor: tryAsU8(gpI),
          patch: tryAsU8(gpP),
        },
      },
      { ignore: ["nodeVersion.patch"] },
    );
  });
});
```
