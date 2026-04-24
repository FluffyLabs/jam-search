---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/protocol.ts#L121-L163
title: packages/workers/api-node/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: f96dde7224aafb12c510d1f783519d638462d64f12f74227fbb14ede9952af20
language: typescript
---
`packages/workers/api-node/protocol.ts` (lines 121–163)

```typescript
      throw new Error(`Unable to start ${protocol.name} worker. Not running in a worker thread!`);
    }

    parentPort.once("close", () => reject(new Error(`(${protocol.name}) parent port closed too early`)));

    let isResolved = false;
    const threadComms = new Listener<ThreadComms>();
    parentPort.on("message", async (msg) => {
      if (!isControlPlane(msg)) {
        logger.error`--> (${protocol.name}) received unexpected message: ${msg}`;
        return;
      }

      if (msg.kind === WorkerControlPlaneMsg.CommunicationPort) {
        logger.trace`--> (${protocol.name}) received comms port with ${msg.threadName}.`;
        threadComms.emit(msg);
        return;
      }

      if (msg.kind === WorkerControlPlaneMsg.Config) {
        if (isResolved) {
          logger.error`--> (${protocol.name}) ignoring duplicated config message.`;
          return;
        }

        logger.trace`--> (${protocol.name}) received configuration.`;
        isResolved = true;
        const config = await LmdbWorkerConfig.fromTransferable(paramsDecoder, msg.config);
        const rxPort = ThreadPort.new(config.chainSpec, msg.parentPort);
        const comms = Channel.rx(protocol, rxPort);

        resolve({
          config,
          comms,
          threadComms,
        });
        return;
      }

      assertNever(msg.kind);
    });
  });
}
```
