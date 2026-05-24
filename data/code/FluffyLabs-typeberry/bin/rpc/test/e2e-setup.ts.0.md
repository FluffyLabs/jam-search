---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/test/e2e-setup.ts#L1-L79
title: bin/rpc/test/e2e-setup.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 4dd57b8f5c22863caf465d2c0bbcc4d26944f62828fc0a449f89e043807c32b0
language: typescript
---
`bin/rpc/test/e2e-setup.ts` (lines 1–79)

```typescript
// biome-ignore-all lint/suspicious/noConsole: bin file

import { loadConfig, NODE_DEFAULTS } from "@typeberry/config-node";
import { Level, Logger } from "@typeberry/logger";
import { importBlocks, JamConfig, main as node } from "@typeberry/node";
import { workspacePathFix } from "@typeberry/utils";

Logger.configureAll(process.env.JAM_LOG ?? "", Level.LOG);

const withRelPath = workspacePathFix(`${import.meta.dirname}/../../..`);

async function main() {
  const nodeConfig = loadConfig([`${import.meta.dirname}/e2e.config.json`], withRelPath);
  const jamConfig = JamConfig.new({
    nodeName: NODE_DEFAULTS.name,
    nodeConfig,
    pvmBackend: NODE_DEFAULTS.pvm,
  });
  try {
    const api = await node(jamConfig, withRelPath, null);
    await importBlocks(api, blocksToImport);
  } catch (e) {
    console.error(`${e}`);
    process.exit(-1);
  }
}

const blocksToImport = [
  "test-vectors/w3f-davxy_072/traces/storage/00000001.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000002.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000003.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000004.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000005.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000006.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000007.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000008.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000009.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000010.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000011.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000012.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000013.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000014.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000015.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000016.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000017.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000018.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000019.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000020.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000021.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000022.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000023.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000024.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000025.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000026.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000027.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000028.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000029.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000030.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000031.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000032.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000033.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000034.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000035.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000036.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000037.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000038.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000039.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000040.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000041.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000042.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000043.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000044.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000045.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000046.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000047.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000048.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000049.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000050.json",
  "test-vectors/w3f-davxy_072/traces/storage/00000051.json",
```
