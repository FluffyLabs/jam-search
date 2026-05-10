---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/concurrent/parent.ts#L1-L114
title: packages/core/concurrent/parent.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 2
content_sha: 813cacc4eb87dbab2312281dd78653f968ee5ee888738599f9e86c88fa6c6928
language: typescript
---
`packages/core/concurrent/parent.ts` (lines 1–114)

```typescript
import { type MessagePort, Worker } from "node:worker_threads";
import { check } from "@typeberry/utils";
import type { IExecutor, MessageIn, MessageOut, WithTransferList } from "./messages.js";

// Amount of tasks in the queue that will trigger creation of new worker thread.
// NOTE this might need to be configurable in the future.
const QUEUE_SIZE_WORKER_THRESHOLD = 5;

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
      workers.push(await initWorker(workerPath));
    }
    return new Executor(workers, options.maxWorkers, workerPath);
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
    this.workers.push(await initWorker(this.workerPath));
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
      if (this.taskQueue.length > QUEUE_SIZE_WORKER_THRESHOLD) {
        this.initNewWorker(() => {
          // process an entry in this newly initialized worker.
          this.processEntryFromTaskQueue();
        });
      }
      return;
    }

```
