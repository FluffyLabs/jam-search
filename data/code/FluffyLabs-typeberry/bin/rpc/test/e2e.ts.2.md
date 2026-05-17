---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/test/e2e.ts#L189-L334
title: bin/rpc/test/e2e.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 4
content_sha: 02ec9daa1ae39b1cda798fa86bfca404553202e29b7fe7d5173961ec0ed35c43
language: typescript
---
`bin/rpc/test/e2e.ts` (lines 189–334)

```typescript
    const socket = client.getSocket();

    socket.send(
      JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method: "unknownMethod",
        params: [],
        id: 1,
      }),
    );

    const message = await new Promise<string>((resolve) => {
      socket.on("message", (data) => {
        resolve(data.toString());
      });
    });

    assert.deepStrictEqual(JSON.parse(message), {
      jsonrpc: "2.0",
      error: { code: -32601, message: "Method not found: unknownMethod" },
      id: 1,
    });
  });

  it("server raises an error when more than necessary parameters are supplied", async () => {
    const bestBlock = await client.call("bestBlock");
    const socket = client.getSocket();

    socket.send(
      JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method: "stateRoot",
        params: [Buffer.from(bestBlock.header_hash).toString("base64"), 0],
        id: 1,
      }),
    );

    const message = await new Promise<string>((resolve) => {
      socket.on("message", (data) => {
        resolve(data.toString());
      });
    });

    assert.deepStrictEqual(JSON.parse(message), {
      jsonrpc: "2.0",
      error: { code: -32602, message: "Invalid params:\n[] Too big: expected array to have <1 items" },
      id: 1,
    });
  });

  it("server raises an error when a parameter of the wrong type is supplied", async () => {
    const bestBlock = await client.call("bestBlock");
    const socket = client.getSocket();

    socket.send(
      JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method: "serviceData",
        params: [Buffer.from(bestBlock.header_hash).toString("base64"), "wrong argument"],
        id: 1,
      }),
    );

    const message = await new Promise<string>((resolve) => {
      socket.on("message", (data) => {
        resolve(data.toString());
      });
    });

    assert.deepStrictEqual(JSON.parse(message), {
      jsonrpc: "2.0",
      error: { code: -32602, message: "Invalid params:\n[1] Invalid input: expected number, received string" },
      id: 1,
    });
  });

  it("server raises an error when no parameters are supplied (even though necessary)", async () => {
    const socket = client.getSocket();

    socket.send(
      JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method: "stateRoot",
        id: 1,
      }),
    );

    const message = await new Promise<string>((resolve) => {
      socket.on("message", (data) => {
        resolve(data.toString());
      });
    });

    assert.deepStrictEqual(JSON.parse(message), {
      jsonrpc: "2.0",
      error: { code: -32602, message: "Invalid params:\n[0] Invalid input: expected string, received undefined" },
      id: 1,
    });
  });

  it("server raises an error when some (not all) parameters are missing", async () => {
    const bestBlock = await client.call("bestBlock");
    const socket = client.getSocket();

    socket.send(
      JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method: "serviceData",
        params: [Buffer.from(bestBlock.header_hash).toString("base64")],
        id: 1,
      }),
    );

    const message = await new Promise<string>((resolve) => {
      socket.on("message", (data) => {
        resolve(data.toString());
      });
    });

    assert.deepStrictEqual(JSON.parse(message), {
      jsonrpc: "2.0",
      error: { code: -32602, message: "Invalid params:\n[1] Invalid input: expected number, received undefined" },
      id: 1,
    });
  });

  it("server raises an error when an unimplemented method is called", async () => {
    const socket = client.getSocket();

    socket.send(
      JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method: "submitPreimage",
        params: [],
        id: 1,
      }),
    );

    const message = await new Promise<string>((resolve) => {
      socket.on("message", (data) => {
        resolve(data.toString());
      });
    });

    assert.deepStrictEqual(JSON.parse(message), {
      jsonrpc: "2.0",
```
