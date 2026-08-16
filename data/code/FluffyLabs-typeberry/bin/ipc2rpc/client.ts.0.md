---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/ipc2rpc/client.ts#L1-L75'
title: bin/ipc2rpc/client.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e074ba3f46286020553e5f5d6e02b31789f6b8df53bdb4f23c8ff221ca678dcc
language: typescript
---
`bin/ipc2rpc/client.ts` (lines 1–75)

```typescript
import { Socket } from "node:net";

import type { ChainSpec } from "@typeberry/config";
import { JamnpIpcHandler } from "@typeberry/ext-ipc/jamnp/handler.js";
import { IpcSender } from "@typeberry/ext-ipc/server.js";
import { ce129, type StreamId, up0 } from "@typeberry/jamnp-s";
import { Logger } from "@typeberry/logger";
import { handleMessageFragmentation } from "@typeberry/networking";

const logger = Logger.new(import.meta.filename, "ipc2rpc/client");

export function startClient(
  spec: ChainSpec,
  socketPath: string,
  getHandshake: () => up0.Handshake,
  onAnnouncement: (streamId: StreamId, ann: up0.Announcement) => void,
  onHandshake: (streamId: StreamId, handshake: up0.Handshake) => void,
): Promise<JamnpIpcHandler> {
  const client = new Socket();

  return new Promise((resolve) => {
    const messageHandler = JamnpIpcHandler.new(IpcSender.new(client));
    messageHandler.registerStreamHandlers(up0.Handler.new(spec, getHandshake, onAnnouncement, onHandshake));
    messageHandler.registerStreamHandlers(ce129.Handler.new(false));

    client.connect(socketPath, () => {
      logger.log`Connected to IPC server`;

      resolve(messageHandler);
    });

    client.setTimeout(10000);

    client.on(
      "data",
      handleMessageFragmentation(
        async (data) => {
          try {
            // to avoid buffering too much data in our memory, we pause
            // reading more data from the socket and only resume when the message
            // is processed.
            client.pause();
            await messageHandler.onSocketMessage(data);
          } catch (e) {
            logger.error`Received invalid data on socket: ${e}. Closing connection.`;
            client.end();
          } finally {
            client.resume();
          }
        },
        () => {
          logger.error`Message too big. Closing connection.`;
          client.end();
        },
      ),
    );

    client.on("timeout", () => {
      messageHandler.onClose({ error: new Error("socket timeout") });
      client.end();
    });

    client.on("error", (error) => {
      logger.error`${error}`;
      messageHandler.onClose({ error });
      client.end();
    });

    client.on("close", () => {
      messageHandler.onClose({});
    });

    resolve(messageHandler);
  });
}
```
