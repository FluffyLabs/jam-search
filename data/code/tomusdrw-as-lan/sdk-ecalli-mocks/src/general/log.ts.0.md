---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/general/log.ts#L1-L24
title: sdk-ecalli-mocks/src/general/log.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 8bcaa1e1291cfca41fd0fe8179bc1bba0bd112723c5a14e1fefaa26516fddc0e
language: typescript
---
`sdk-ecalli-mocks/src/general/log.ts` (lines 1–24)

```typescript
import { readUtf8 } from "../memory.js";

const LOG_LEVELS = ["FATAL", "WARN ", "INFO ", "DEBUG", "TRACE"];

export function log(
  level: number,
  target_ptr: number,
  target_len: number,
  message_ptr: number,
  message_len: number,
): number {
  const levelStr = LOG_LEVELS[level] ?? `LVL${level}`;
  const target = readUtf8(target_ptr, target_len);
  const message = readUtf8(message_ptr, message_len);

  if (target && message) {
    console.log(`[${levelStr}] ${target}: ${message}`);
  } else if (message) {
    console.log(`[${levelStr}] ${message}`);
  } else {
    console.log(`[${levelStr}] (ptr=${message_ptr} len=${message_len})`);
  }
  return 0;
}
```
