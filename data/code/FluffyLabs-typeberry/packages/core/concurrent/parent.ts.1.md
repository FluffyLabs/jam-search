---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/concurrent/parent.ts#L105-L186
title: packages/core/concurrent/parent.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 4c56eb5cdefb14274d923d4e41338fc94cc0c28ab3078fc953616ba2a9f5e9af
language: typescript
---
`packages/core/concurrent/parent.ts` (lines 105–186)

```typescript
  private processEntryFromTaskQueue() {
    const freeWorker = this.freeWorkerIndices.pop();
    // no free workers available currently,
    // we will retry when one of the tasks completes.
    if (freeWorker === undefined) {
      if (this.taskQueue.length > QUEUE_SIZE_WORKER_THRESHOLD) {
        this.initNewWorker(() => {
          // process an entry in this newly initialized worker.
          this.processEntryFromTaskQueue();
        });
      }
      return;
    }

    const task = this.taskQueue.pop();
    // no tasks in the queue
    if (task === undefined) {
      this.freeWorkerIndices.push(freeWorker);
      return;
    }

    const worker = this.workers[freeWorker];
    worker.runTask(task, () => {
      // mark the worker as available again
      this.freeWorkerIndices.push(freeWorker);
      // and continue processing the queue
      this.processEntryFromTaskQueue();
    });
  }
}

type Task<TParams, TResult> = {
  params: TParams;
  resolve: (x: TResult) => void;
  reject: (x: Error) => void;
};

async function initWorker<XParams extends WithTransferList, XResult>(
  workerPath: URL,
  maxOldGenerationSizeMb: number = DEFAULT_MAX_HEAP_SIZE_MB,
): Promise<WorkerChannel<XParams, XResult>> {
  // create a worker and initialize communication channel
  const { port1, port2 } = new MessageChannel();
  const workerThread = new Worker(workerPath, { resourceLimits: { maxOldGenerationSizeMb } });
  workerThread.postMessage(port1, [port1]);
  // // wait for the worker to start
  await new Promise((resolve, reject) => {
    workerThread.once("message", resolve);
    workerThread.once("error", reject);
  });
  // make sure the threads don't prevent the program from stopping.
  workerThread.unref();
  return WorkerChannel.new(workerThread, port2);
}

class WorkerChannel<TParams extends WithTransferList, TResult> {
  static new<TParams extends WithTransferList, TResult>(worker: Worker, port: MessagePort) {
    return new WorkerChannel<TParams, TResult>(worker, port);
  }

  private constructor(
    public readonly worker: Worker,
    public readonly port: MessagePort,
  ) {}

  runTask(task: Task<TParams, TResult>, onFinish: () => void) {
    const message: MessageIn<TParams> = {
      params: task.params,
    };
    // when we receive a response, make sure to process it
    this.port.once("message", (e: MessageOut<TResult>) => {
      if (e.isOk) {
        task.resolve(e.ok);
      } else {
        task.reject(new Error(e.error));
      }
      onFinish();
    });
    // send the task to work on.
    this.port.postMessage(message, message.params.getTransferList());
  }
}
```
