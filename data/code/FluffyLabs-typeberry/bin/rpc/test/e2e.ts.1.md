---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/test/e2e.ts#L93-L199'
title: bin/rpc/test/e2e.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 4
content_sha: f3a2175dc8558a37f775216d5d0df72f637618118c3e33b8bb848f2a596de1dd
language: typescript
---
`bin/rpc/test/e2e.ts` (lines 93–199)

```typescript
        "d1b097b4410b3a63446d7c57d093972a9744fcd2d74f4a5e2ec163610e6d6327ffffffffffffffff0a000000000000000a000000000000007c20020000000000ffffffffffffffff1a000000000000006200000000000000",
      ),
    );
  });

  it("gets service value", async () => {
    const bestBlock = await client.call("bestBlock");
    const result = await client.call("serviceValue", [
      bestBlock.header_hash,
      1,
      hexToUint8Array("0242a295a93ac7f3ba564f0be83089a647a9bd3861798cf9fbffae0daa2ce1ff"),
    ]);
    assert.deepStrictEqual(result, null);
  });

  // The preimage hash comes from the post state of block 100 (can be extracted using the state viewer tool)
  const testPreimageHash = hexToUint8Array("d1b097b4410b3a63446d7c57d093972a9744fcd2d74f4a5e2ec163610e6d6327");

  it("gets service preimage", async () => {
    const bestBlock = await client.call("bestBlock");
    const data = await client.call("servicePreimage", [bestBlock.header_hash, 0, testPreimageHash]);
    assert.deepStrictEqual(data?.length, 137056);
  });

  it("gets service request", async () => {
    const bestBlock = await client.call("bestBlock");
    const result = await client.call("serviceRequest", [bestBlock.header_hash, 0, testPreimageHash, 137056]);
    assert.deepStrictEqual(result, [0]);
  });

  it("lists services", async () => {
    const bestBlock = await client.call("bestBlock");
    const result = await client.call("listServices", [bestBlock.header_hash]);
    // TODO [ToDr] We should probably do a little bit better in terms of
    // tracking recently active services. Some options for the future:
    // 1. Use InMemoryDb for RPC E2E tests.
    // 2. Store additional service metadata in LMDB
    // 3. Cache the state object, so that accessed services would be returned here.
    assert.deepStrictEqual(result, []);
  });

  it("subscribes and unsubscribes to/from service preimage", async () => {
    const subscription = await client.subscribe("subscribeServicePreimage", [0, testPreimageHash, false]);

    try {
      const data = await new Promise<string>((resolve) =>
        subscription.once("data", (result) => resolve(result as string)),
      );
      assert.deepStrictEqual(data.length, 182744);
    } finally {
      await subscription.unsubscribe();
    }
  });

  it("client handles errors when subscription is being requested", async () => {
    await assert.rejects(async () =>
      client.subscribe("subscribeServicePreimage", [
        0,
        hexToUint8Array("c16326432b5b3213dfd1609495e13c6b276cb474d679645337e5c2c09f19b53c3d"), // invalid preimage hash
        false,
      ]),
    );
  });

  it("client handles errors produced by the subscription", async (test) => {
    const handlers = server.getHandlers();
    const originalHandler = handlers.subscribeBestBlock;
    handlers.subscribeBestBlock = async (params, { subscription }) => {
      return subscription.subscribe(
        "subscribeBestBlock",
        () => {
          throw new Error("Forced error for bestBlock");
        },
        validation.schemas.bestBlock.output,
        params,
      );
    };
    test.after(() => {
      handlers.subscribeBestBlock = originalHandler;
    });
    return new Promise<void>((resolve, reject) => {
      client.subscribe("subscribeBestBlock", []).then((subscription) => {
        subscription.on("data", async () => {
          await subscription.unsubscribe();
          reject(new Error("Subscription callback should not be called."));
        });
        subscription.on("error", async (error) => {
          assert.strictEqual(error, "Error: Forced error for bestBlock");
          await subscription.unsubscribe();
          resolve();
        });
      });
    });
  });

  it("server raises an error for unknown method", async () => {
    const socket = client.getSocket();

    socket.send(
      JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method: "unknownMethod",
        params: [],
        id: 1,
      }),
    );

```
