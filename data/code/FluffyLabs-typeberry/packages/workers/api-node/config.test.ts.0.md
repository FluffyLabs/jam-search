---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.test.ts#L1-L106
title: packages/workers/api-node/config.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 5f5176c1f5e768a2db8c7e74dcc7a186e08f9ecd205f9efa09a3827562547ecc
language: typescript
---
`packages/workers/api-node/config.test.ts` (lines 1–106)

```typescript
import assert from "node:assert";
import * as fs from "node:fs";
import { describe, it } from "node:test";
import { MessageChannel } from "node:worker_threads";
import type { HeaderHash } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { codec } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import { tryAsU32 } from "@typeberry/numbers";
import { configTransferList, FjallWorkerConfig, HybridWorkerConfig, LmdbWorkerConfig } from "./config.js";
import { ThreadPort } from "./port.js";

const spec = tinyChainSpec;

describe("LmdbWorkerConfig transfer list", () => {
  it("surfaces embedded worker ports so they can be transferred", async () => {
    const blake2b = await Blake2b.createHasher();
    const [portA, portB] = ThreadPort.pair(spec);
    const config = LmdbWorkerConfig.new({
      nodeName: "node",
      chainSpec: spec,
      workerParams: tryAsU32(7),
      dbPath: "db",
      blake2b,
      ports: new Map([["authorship-network", portA]]),
    });

    const transferable = config.intoTransferable(codec.varU32);
    const transferList = configTransferList(transferable);

    // the single embedded comms port must be reported for transfer
    assert.strictEqual(transferList.length, 1);

    const sink = new MessageChannel();
    try {
      // reproduces the bug: a config carrying a port cannot be cloned without
      // listing that port in the transfer list.
      assert.throws(() => sink.port1.postMessage(transferable, []), /transfer/i);
      // with the ports surfaced, posting succeeds.
      assert.doesNotThrow(() => sink.port1.postMessage(transferable, transferList));
    } finally {
      sink.port1.close();
      sink.port2.close();
      portB.close();
    }
  });
});

describe("FjallWorkerConfig transfer list", () => {
  it("surfaces embedded worker ports and marks the backend", async () => {
    const blake2b = await Blake2b.createHasher();
    const [portA, portB] = ThreadPort.pair(spec);
    const config = FjallWorkerConfig.new({
      nodeName: "node",
      chainSpec: spec,
      workerParams: tryAsU32(7),
      dbPath: "db",
      blake2b,
      ports: new Map([["authorship-network", portA]]),
    });

    try {
      const transferable = config.intoTransferable(codec.varU32);
      assert.strictEqual(transferable.databaseBackend, "fjall");
      assert.strictEqual(configTransferList(transferable).length, 1);
    } finally {
      portA.close();
      portB.close();
    }
  });

  it("opens writable and read-only handles over one shared fjall path", async () => {
    const blake2b = await Blake2b.createHasher();
    const dbPath = fs.mkdtempSync("typeberry-fjall-worker-");
    const config = FjallWorkerConfig.new({
      nodeName: "node",
      chainSpec: spec,
      workerParams: undefined,
      dbPath,
      blake2b,
    });
    let writer: Awaited<ReturnType<typeof config.openDatabase>> | null = null;
    let reader: Awaited<ReturnType<typeof config.openDatabase>> | null = null;
    try {
      writer = await config.openDatabase({ readonly: false });
      reader = await config.openDatabase({ readonly: true });

      const best = Bytes.fill(HASH_SIZE, 9).asOpaque<HeaderHash>();
      await writer.getBlocksDb().setBestHeaderHash(best);

      assert.strictEqual(reader.getBlocksDb().getBestHeaderHash().toString(), best.toString());
    } finally {
      await reader?.close();
      await writer?.close();
      fs.rmSync(dbPath, { recursive: true, force: true });
    }
  });
});

describe("HybridWorkerConfig", () => {
  // Both persistent backends must construct asynchronously and hand out a
  // working db. fjall is the experimental backend we want to benchmark.
  for (const backend of ["lmdb", "fjall"] as const) {
    it(`constructs and opens a ${backend}-backed hybrid db`, async () => {
      const blake2b = await Blake2b.createHasher();
```
