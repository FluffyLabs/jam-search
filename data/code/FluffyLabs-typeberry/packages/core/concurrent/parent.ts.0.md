---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/concurrent/parent.ts#L1-L109
title: packages/core/concurrent/parent.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 2
content_sha: e3eacd5072fc00e76925843f10e75a39f0762e0bb9ea03edd1c9eb4b490aa82f
language: typescript
---
`packages/core/concurrent/parent.ts` (lines 1–109)

```typescript
import { type MessagePort, Worker } from "node:worker_threads";
import { check } from "@typeberry/utils";
import type { IExecutor, MessageIn, MessageOut, WithTransferList } from "./messages.js";

// Amount of tasks in the queue that will trigger creation of new worker thread.
// NOTE this might need to be configurable in the future.
const QUEUE_SIZE_WORKER_THRESHOLD = 5;
const DEFAULT_MAX_HEAP_SIZE_MB = 2048;

/** Executor options. */
export type ExecutorOptions = {
  /** Minimal and initial number of workers, initialized before start. */
  minWorkers: number;
  /**
   * Maximal number of workers that can be created in total.
   *
   * Workers between `(minWorkers, maxWorkers]` are created on demand,
   * when there is too many tasks pending in the queue.
   */
  maxWorkers: number;
  /** Worker heap size limit (defaults to 2048 MB) */
  maxHeapSize?: number;
};

/** Execution pool manager. */
export class Executor<TParams extends WithTransferList, TResult> implements IExecutor<TParams, TResult> {
  /** Initialize a new concurrent executor given a path to the worker. */
  static async initialize<XParams extends WithTransferList, XResult extends WithTransferList>(
    workerPath: URL,
    options: ExecutorOptions,
  ): Promise<Executor<XParams, XResult>> {
    check`${options.maxWorkers > 0} Max workers has to be positive.`;
    check`${options.minWorkers <= options.maxWorkers} Min workers must be less than or equal to max workers (min=${options.minWorkers}, max=${options.maxWorkers}).`;

    const workers: WorkerChannel<XParams, XResult>[] = [];
    for (let i = 0; i < options.minWorkers; i++) {
      workers.push(await initWorker(workerPath, options.maxHeapSize));
    }
    return new Executor(workers, options.maxWorkers, workerPath, options.maxHeapSize);
  }
  // keeps track of the indices of worker threads that are currently free and available to execute tasks
  private readonly freeWorkerIndices: number[] = [];
  private readonly taskQueue: Task<TParams, TResult>[] = [];
  private isDestroyed = false;
  private isWorkerInitializing = false;

  private constructor(
    private readonly workers: WorkerChannel<TParams, TResult>[],
    private readonly maxWorkers: number,
    private readonly workerPath: URL,
    private readonly maxHeapSize?: number,
  ) {
    // intial free workers.
    for (let i = 0; i < workers.length; i++) {
      this.freeWorkerIndices.push(i);
    }
  }

  /** Attempt to initialize a new worker. */
  async initNewWorker(onSuccess: () => void = () => {}) {
    if (this.workers.length >= this.maxWorkers) {
      // biome-ignore lint/suspicious/noConsole: warning
      console.warn(`Task queue has ${this.taskQueue.length} pending items and we can't init any more workers.`);
      return;
    }
    if (this.isWorkerInitializing) {
      return;
    }

    this.isWorkerInitializing = true;
    this.workers.push(await initWorker(this.workerPath, this.maxHeapSize));
    this.freeWorkerIndices.push(this.workers.length - 1);
    this.isWorkerInitializing = false;
    onSuccess();
  }

  /** Terminate all workers and clear the executor. */
  async destroy() {
    for (const worker of this.workers) {
      worker.port.close();
      await worker.worker.terminate();
    }
    this.workers.length = 0;
    this.isDestroyed = true;
  }

  /** Execute a task with given parameters. */
  async run(params: TParams): Promise<TResult> {
    return new Promise((resolve, reject) => {
      if (this.isDestroyed) {
        reject("pool destroyed");
        return;
      }

      this.taskQueue.push({
        params,
        resolve,
        reject,
      });
      this.processEntryFromTaskQueue();
    });
  }

  /** Process single element from the task queue. */
  private processEntryFromTaskQueue() {
    const freeWorker = this.freeWorkerIndices.pop();
    // no free workers available currently,
    // we will retry when one of the tasks completes.
    if (freeWorker === undefined) {
```
