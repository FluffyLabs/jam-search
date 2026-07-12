---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/shutdown.ts#L1-L23
title: packages/core/utils/shutdown.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e8b921676acb679dd8ff9aac6f8f8fbb405d4ed147e61308ea2ab8437a48adcf
language: typescript
---
`packages/core/utils/shutdown.ts` (lines 1–23)

```typescript
export type Closer = () => Promise<void>;

export type ShutdownSignal = string;

export interface ShutdownLogger {
  info: (msg: string) => void;
  error: (msg: string) => void;
}

export interface ShutdownOptions {
  /** Max ms allowed for `close` before forced exit(1). Default 10_000. */
  timeoutMs?: number;
  /** Signals to listen for. Default ["SIGTERM", "SIGINT"]. */
  signals?: readonly ShutdownSignal[];
  /** Logger; defaults to a no-op logger. */
  log?: ShutdownLogger;
  /** Test hook used instead of process.exit. */
  exit?: (code: number) => never;
}

export function installShutdownHandlers(_close: Closer, _options: ShutdownOptions = {}): () => void {
  return () => {};
}
```
