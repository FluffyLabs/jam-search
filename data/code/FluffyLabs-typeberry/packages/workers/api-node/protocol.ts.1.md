---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/protocol.ts#L116-L177
title: packages/workers/api-node/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c2543ff5d86b836e858736fd79ff6489a21e61658daa480b4de6ac6680417d30
language: typescript
---
`packages/workers/api-node/protocol.ts` (lines 116–177)

```typescript
  paramsDecoder: Decode<Params>,
): Promise<{
  config: PersistentWorkerConfig<Params>;
  comms: Internal<typeof protocol>;
  threadComms: Listener<ThreadComms>;
}> {
  // configure logger inside a worker thread
  Logger.configureAll(process.env.JAM_LOG ?? "", Level.LOG);

  logger.trace`Worker ${protocol.name} starting.`;
  logHeapLimit(logger, protocol.name);

  return new Promise((resolve, reject) => {
    const workerParentPort = parentPort;
    if (workerParentPort === null) {
      throw new Error(`Unable to start ${protocol.name} worker. Not running in a worker thread!`);
    }

    workerParentPort.once("close", () => reject(new Error(`(${protocol.name}) parent port closed too early`)));

    let isResolved = false;
    const threadComms = new Listener<ThreadComms>();
    workerParentPort.on("message", async (msg) => {
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
        try {
          const config = await persistentConfigFromTransferable(paramsDecoder, msg.config);
          const rxPort = ThreadPort.new(config.chainSpec, msg.parentPort);
          const comms = Channel.rx(protocol, rxPort);

          resolve({
            config,
            comms,
            threadComms,
          });
        } catch (e) {
          reject(e);
        }
        return;
      }

      assertNever(msg.kind);
    });
  });
}
```
