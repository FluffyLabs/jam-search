---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/protocol.ts#L1-L122
title: packages/workers/api-node/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: f44f048120f9669dbc75d1350892fa4a8430827ade959540ba89d3c80824212b
language: typescript
---
`packages/workers/api-node/protocol.ts` (lines 1–122)

```typescript
import { MessageChannel, type MessagePort, parentPort, Worker } from "node:worker_threads";
import type { Decode, Encode } from "@typeberry/codec";
import { Listener } from "@typeberry/listener";
import { Level, Logger } from "@typeberry/logger";
import { assertNever } from "@typeberry/utils";
import { Channel } from "@typeberry/workers-api";
import type { Api, Internal, LousyProtocol } from "@typeberry/workers-api/types.js";
import {
  configTransferList,
  type PersistentWorkerConfig,
  persistentConfigFromTransferable,
  type TransferableConfig,
} from "./config.js";
import { logHeapLimit, workerResourceLimits } from "./host-environment.js";
import { ThreadPort } from "./port.js";

const logger = Logger.new(import.meta.filename, "workers");

/** Type of the control plane message. */
export enum WorkerControlPlaneMsg {
  /** Transfers a communication port to some other thread. */
  CommunicationPort = 0,
  /** Transfers worker configuration. */
  Config = 1,
}

export type ThreadComms = {
  /** Name of the thread we can communicate with. */
  threadName: string;
  /** Communication port. */
  port: MessagePort;
};
/** Control plane message. Received received from parent thread, only on `parentPort`. */
export type WorkerControlPlane =
  | ({
      /** Direct communication port with some other thread. */
      kind: WorkerControlPlaneMsg.CommunicationPort;
    } & ThreadComms)
  | {
      /** Configuration object for a worker and parent-thread communication port. */
      kind: WorkerControlPlaneMsg.Config;
      /** Main thread communication port. */
      parentPort: MessagePort;
      /** Configuration object. */
      config: TransferableConfig;
    };

function isControlPlane(data: unknown): data is WorkerControlPlane {
  const isObject = data !== null && typeof data === "object";
  if (!isObject) {
    return false;
  }

  if ("kind" in data && typeof data.kind === "number" && WorkerControlPlaneMsg[data.kind] !== undefined) {
    return true;
  }

  return false;
}

/**
 * Invoked by the main thread, to spawn a worker thread and initiate communication channel.
 */
export function spawnWorker<To, From, Params>(
  protocol: LousyProtocol<To, From>,
  bootstrapPath: URL,
  config: PersistentWorkerConfig<Params>,
  paramsEncoder: Encode<Params>,
): {
  api: Api<typeof protocol>;
  worker: Worker;
  workerFinished: Promise<void>;
} {
  logger.trace`Spawning ${protocol.name} child worker.`;

  const channel = new MessageChannel();
  const worker = new Worker(bootstrapPath, { resourceLimits: workerResourceLimits() });

  const msg: WorkerControlPlane = {
    kind: WorkerControlPlaneMsg.Config,
    parentPort: channel.port2,
    config: config.intoTransferable(paramsEncoder),
  };

  logger.trace`(${protocol.name}) <-- config`;
  // send the config down to the worker. We need to transfer the parent
  // communication port as well as any inter-worker ports carried in the config,
  // otherwise structured clone fails with a `DataCloneError`.
  worker.postMessage(msg, [msg.parentPort, ...configTransferList(msg.config)]);

  const workerFinished = new Promise<void>((resolve, reject) => {
    worker.once("error", reject);
    worker.once("exit", (exitCode) => {
      if (exitCode === 0) {
        resolve();
      } else {
        reject(new Error(`(${protocol.name}) exit code: ${exitCode}`));
      }
    });
  });

  // now return communication channel with that worker
  const txPort = ThreadPort.new(config.chainSpec, channel.port1);
  return {
    api: Channel.tx(protocol, txPort),
    worker,
    workerFinished,
  };
}

/**
 * Initialize worker thread by awaiting the config message.
 */
export async function initWorker<To, From, Params>(
  protocol: LousyProtocol<To, From>,
  paramsDecoder: Decode<Params>,
): Promise<{
  config: PersistentWorkerConfig<Params>;
  comms: Internal<typeof protocol>;
  threadComms: Listener<ThreadComms>;
}> {
  // configure logger inside a worker thread
```
