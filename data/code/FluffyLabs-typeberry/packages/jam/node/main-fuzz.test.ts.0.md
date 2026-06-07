---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.test.ts#L1-L64
title: packages/jam/node/main-fuzz.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6b3ead7516c70c23a71a5c6816ce59d56e0b904b5814d2c3aea08ee19f7ef191
language: typescript
---
`packages/jam/node/main-fuzz.test.ts` (lines 1–64)

```typescript
import assert from "node:assert";
import * as fs from "node:fs";
import { describe, it } from "node:test";
import { tryAsU8 } from "@typeberry/numbers";
import { CURRENT_VERSION, deepEqual, version } from "@typeberry/utils";
import { getFuzzDetails, resolveFuzzDbBase, wipeFuzzDb } from "./main-fuzz.js";

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

describe("resolveFuzzDbBase", () => {
  it("returns undefined when no base path is configured", () => {
    assert.strictEqual(resolveFuzzDbBase(undefined), undefined);
  });

  it("returns undefined for empty and the 'undefined' sentinel", () => {
    assert.strictEqual(resolveFuzzDbBase(""), undefined);
    assert.strictEqual(resolveFuzzDbBase("  undefined  "), undefined);
  });

  it("appends the dedicated fuzz subdir for a real path", () => {
    assert.strictEqual(resolveFuzzDbBase("/tmp/jam-data"), "/tmp/jam-data/typeberry-fuzz-db");
  });
});

describe("wipeFuzzDb", () => {
  it("removes an existing directory and its contents", async () => {
    const dir = fs.mkdtempSync("typeberry-fuzz-wipe-");
    fs.writeFileSync(`${dir}/marker`, "x");
    await wipeFuzzDb(dir);
    assert.strictEqual(fs.existsSync(dir), false);
  });

  it("is a no-op when the directory does not exist", async () => {
    const dir = fs.mkdtempSync("typeberry-fuzz-wipe-");
    fs.rmSync(dir, { recursive: true, force: true });
    // must not throw
    await wipeFuzzDb(dir);
    assert.strictEqual(fs.existsSync(dir), false);
  });
});
```
