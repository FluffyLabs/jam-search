---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc/test/e2e.ts#L1-L98
title: packages/jam/rpc/test/e2e.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 02bd20469d1d9b2ff4f1fe735aead7a2a9aea55eecc12ed29fc9c0217dcd67ac
language: typescript
---
`packages/jam/rpc/test/e2e.ts` (lines 1–98)

```typescript
import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { RpcClient } from "@typeberry/rpc-client";
import { JSON_RPC_VERSION, validation } from "@typeberry/rpc-validation";
import type { RpcServer } from "../src/server.js";
import { startTestRpcServer } from "./e2e-server.js";

function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(Buffer.from(hex, "hex"));
}

describe("JSON RPC Client-Server E2E", { concurrency: false }, () => {
  let client: RpcClient;
  let server: RpcServer;

  before(async () => {
    server = await startTestRpcServer(`${import.meta.dirname}/e2e.config.json`);
    client = RpcClient.new("ws://localhost:19800");
    await client.waitForConnection();
  });

  after(async () => {
    client.close();
    await server.close();
  });

  it("gets best block", async () => {
    const result = await client.call("bestBlock");
    assert.deepStrictEqual(result, {
      header_hash: hexToUint8Array("9eb96a960cb553d5b27a63e6df4bf422c2781d8a013d9dcfbe32a30ef25afd52"),
      slot: 100,
    });
  });

  it("gets finalized block", async () => {
    // todo [seko] we're temporarily returning the best instead of finalized block
    const result = await client.call("finalizedBlock");
    assert.deepStrictEqual(result, {
      header_hash: hexToUint8Array("9eb96a960cb553d5b27a63e6df4bf422c2781d8a013d9dcfbe32a30ef25afd52"),
      slot: 100,
    });
  });

  it("gets parent block", async () => {
    const bestBlock = await client.call("bestBlock");
    const result = await client.call("parent", [bestBlock.header_hash]);
    assert.deepStrictEqual(result, {
      header_hash: hexToUint8Array("958ff3540f9641de3b7e1d89272c5979c0d7071817d9f5cd691d4f7fdb97e4d2"),
      slot: 99,
    });
  });

  it("throws an error when a non-existing block hash is provided", async () => {
    await assert.rejects(
      async () => {
        await client.call("parent", [
          hexToUint8Array("1111111111111111111111111111111111111111111111111111111111111111"),
        ]);
      },
      {
        code: 1,
        message: "Block unavailable: 0x1111111111111111111111111111111111111111111111111111111111111111",
        data: "ERERERERERERERERERERERERERERERERERERERERERE=",
      },
    );
  });

  it("gets state root", async () => {
    const bestBlock = await client.call("bestBlock");
    const result = await client.call("stateRoot", [bestBlock.header_hash]);
    assert.deepStrictEqual(result, hexToUint8Array("a685a3a56825043f0de06709e023d8fd83a8a311f3fe20b47fdd0f93706d1323"));
  });

  it("gets statistics", async () => {
    const bestBlock = await client.call("bestBlock");
    const result = await client.call("statistics", [bestBlock.header_hash]);

    assert.deepStrictEqual(
      result,
      hexToUint8Array(
        "01000000000000000000000000000000020000000500000002000000000000000000000000000000020000000500000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000500000001000000000000000000000000000000000000000300000001000000000000000000000000000000020000000300000002000000000000000000000000000000040000000a00000002000000000000000000000000000000060000000b00000003000000000000000000000000000000060000000c00000003000000000000000000000000000000040000000c00000001000000000000000000000000000000040000000a00000001000000000000000000000000000000060000000a000000000300128519008be9c30c0500000000000000000100000000000004c30c0500128519000000",
      ),
    );
  });

  it("gets service data", async () => {
    const bestBlock = await client.call("bestBlock");
    const result = await client.call("serviceData", [bestBlock.header_hash, 0]);

    assert.deepStrictEqual(
      result,
      hexToUint8Array(
        "d1b097b4410b3a63446d7c57d093972a9744fcd2d74f4a5e2ec163610e6d6327ffffffffffffffff0a000000000000000a000000000000007c20020000000000ffffffffffffffff1a000000000000006200000000000000",
      ),
    );
  });

  it("gets service value", async () => {
```
