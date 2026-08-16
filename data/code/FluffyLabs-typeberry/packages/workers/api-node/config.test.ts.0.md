---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.test.ts#L1-L112
title: packages/workers/api-node/config.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: cd898dc19c42418a5eff9801df0d749a9fe9ea93de9301b756bc79c02563a6f7
language: typescript
---
`packages/workers/api-node/config.test.ts` (lines 1–112)

```typescript
import assert from "node:assert";
import * as fs from "node:fs";
import { describe, it } from "node:test";
import type { HeaderHash } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { codec } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { FjallRoot } from "@typeberry/database-fjall";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import { tryAsU32 } from "@typeberry/numbers";
import { configTransferList, FjallWorkerConfig, HybridWorkerConfig } from "./config.js";
import { ThreadPort } from "./port.js";

const spec = tinyChainSpec;

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

  it("can borrow a shared fjall root without closing it", async () => {
    const blake2b = await Blake2b.createHasher();
    const dbPath = fs.mkdtempSync("typeberry-fjall-worker-shared-");
    const root = await FjallRoot.open(dbPath, { ephemeral: true });
    const config = FjallWorkerConfig.new({
      nodeName: "node",
      chainSpec: spec,
      workerParams: undefined,
      dbPath,
      blake2b,
      sharedFjallKeyspace: root,
    });
    try {
      const db = await config.openDatabase({ readonly: false });
      await db.close();

      await root.deletePartition("headers");
      const headers = await root.writablePartition("headers");
      assert.strictEqual(headers.get(Bytes.zero(HASH_SIZE).raw), null);
    } finally {
      await root.close();
      fs.rmSync(dbPath, { recursive: true, force: true });
    }
  });
});

describe("HybridWorkerConfig", () => {
  it("constructs and opens a fjall-backed hybrid db", async () => {
    const blake2b = await Blake2b.createHasher();
    const dbPath = fs.mkdtempSync("typeberry-hybrid-fjall-");
    try {
      const config = await HybridWorkerConfig.new({
        nodeName: "node",
        chainSpec: spec,
        workerParams: undefined,
        blake2b,
        dbPath,
        ephemeral: true,
      });

      const db = await config.openDatabase({ readonly: false });
      const states = db.getStatesDb();
      try {
        assert.notStrictEqual(db.getBlocksDb(), undefined);
        assert.notStrictEqual(states, undefined);
      } finally {
        // The values store owns the on-disk resources (the no-op db.close()
```
