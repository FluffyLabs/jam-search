---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/protocol.ts#L115-L167
title: packages/workers/api-node/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: 2fd7dd709cebb02a8ca0f4b97edde5c84bc44e89eb97607696dd751f570f49e5
language: typescript
---
`packages/workers/api-node/protocol.ts` (lines 115–167)

```typescript
  threadComms: Listener<ThreadComms>;
}> {
  // configure logger inside a worker thread
  Logger.configureAll(process.env.JAM_LOG ?? "", Level.LOG);

  logger.trace`Worker ${protocol.name} starting.`;
  logHeapLimit(logger, protocol.name);

  return new Promise((resolve, reject) => {
    if (parentPort === null) {
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
