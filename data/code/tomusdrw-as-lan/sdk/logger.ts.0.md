---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/logger.ts#L1-L55'
title: sdk/logger.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f12023d5e2c9d86a6dff35c83864f91087728cffe7f3933b3e7bca619b42657a
language: typescript
---
`sdk/logger.ts` (lines 1–55)

```typescript
import { log } from "./ecalli";

/** Log levels matching JIP-1 specification */
export enum LogLevel {
  Fatal = 0,
  Warning = 1,
  Important = 2,
  Helpful = 3,
  Pedantic = 4,
}

// @ts-expect-error: ASC_OPTIMIZE_LEVEL is an AssemblyScript compile-time constant
const DEBUG_LOGGING: bool = ASC_OPTIMIZE_LEVEL < 3;

export class Logger {
  private readonly target: string;

  static create(target: string): Logger {
    return new Logger(target);
  }

  private constructor(target: string) {
    this.target = target;
  }

  fatal(message: string): void {
    this._log(LogLevel.Fatal, message);
  }

  warn(message: string): void {
    this._log(LogLevel.Warning, message);
  }

  info(message: string): void {
    this._log(LogLevel.Important, message);
  }

  debug(message: string): void {
    if (DEBUG_LOGGING) {
      this._log(LogLevel.Helpful, message);
    }
  }

  trace(message: string): void {
    if (DEBUG_LOGGING) {
      this._log(LogLevel.Pedantic, message);
    }
  }

  private _log(level: LogLevel, message: string): void {
    const targetBuf = String.UTF8.encode(this.target);
    const msgBuf = String.UTF8.encode(message);
    log(level, changetype<u32>(targetBuf), targetBuf.byteLength, changetype<u32>(msgBuf), msgBuf.byteLength);
  }
}
```
