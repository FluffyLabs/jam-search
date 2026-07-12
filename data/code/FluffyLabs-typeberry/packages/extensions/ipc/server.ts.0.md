---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/extensions/ipc/server.ts#L1-L126
title: packages/extensions/ipc/server.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e3b25ccecba60441d7b8127bfee26674a4966b22fd761000d62fa3067f5493e0
language: typescript
---
`packages/extensions/ipc/server.ts` (lines 1–126)

```typescript
import * as fs from "node:fs";
import { createServer, type Socket } from "node:net";
import * as os from "node:os";
import * as path from "node:path";

import type { BytesBlob } from "@typeberry/bytes";
import type { IpcHandler } from "@typeberry/fuzz-proto";
import { Logger } from "@typeberry/logger";
import { encodeMessageLength, handleMessageFragmentation } from "@typeberry/networking";

/** Sending data abstraction on a socket. */
export class IpcSender {
  static new(socket: Socket) {
    return new IpcSender(socket);
  }

  private constructor(private readonly socket: Socket) {}

  /** Write given data to the outgoing socket. */
  send(data: BytesBlob): void {
    sendWithLengthPrefix(this.socket, data.raw);
  }

  /** Close the socket. */
  close(): void {
    this.socket.end();
  }
}

export function startIpcServer(name: string, newMessageHandler: (socket: IpcSender) => IpcHandler) {
  // Define the path for the socket or named pipe
  const isWindows = os.platform() === "win32";
  const linuxPath = name.startsWith("/") ? name : path.join(os.tmpdir(), `${name}`);
  const socketPath = isWindows ? `\\\\.\\pipe\\${name}` : linuxPath;

  const logger = Logger.new(import.meta.filename, "ext-ipc");

  // Create the IPC server
  const server = createServer((socket: Socket) => {
    logger.log`Client connected`;
    const messageHandler = newMessageHandler(IpcSender.new(socket));

    // Handle incoming data from the client
    socket.on(
      "data",
      handleMessageFragmentation(
        async (data: Uint8Array) => {
          try {
            // to avoid buffering too much data in our memory, we pause
            // reading more data from the socket and only resume when the message
            // is processed.
            socket.pause();
            await messageHandler.onSocketMessage(data);
          } catch (e) {
            logger.error`Received invalid data on socket: ${e}. Closing connection.`;
            socket.end();
          } finally {
            socket.resume();
          }
        },
        () => {
          logger.error`Received too much data on socket. Closing connection.`;
          socket.end();
        },
      ),
    );

    // Handle client disconnection
    socket.on("end", () => {
      logger.log`Client disconnected`;
      messageHandler.onClose({});
    });

    socket.on("error", (error) => {
      logger.error`Socket error: ${error}`;
      messageHandler.onClose({ error });
      socket.end();
    });
  });

  // Start the server (remove old socket if present)
  try {
    fs.unlinkSync(socketPath);
  } catch {}

  const controller = new AbortController();
  server.listen(
    {
      path: socketPath,
      signal: controller.signal,
    },
    () => {
      logger.log`IPC server is listening at ${socketPath}`;
    },
  );

  // Handle server errors
  server.on("error", (err) => {
    throw err;
  });

  return () => {
    logger.info`Closing IPC server.`;
    // stop accepting new connections
    server.close();
    // abort the server
    controller.abort();
    // unrefing
    server.unref();
    // Windows named pipes are cleaned up by the OS; Unix sockets are not.
    if (!isWindows) {
      try {
        fs.unlinkSync(socketPath);
      } catch {}
    }
  };
}

/**
 * Send a message to the socket, prefixed with a 32-bit length
 * so the receiver can determine the boundaries between data items.
 */
function sendWithLengthPrefix(socket: Socket, data: Uint8Array) {
  socket.write(encodeMessageLength(data));
  socket.write(data);
}
```
