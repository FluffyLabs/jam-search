---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/logger/transport.ts#L1-L20
title: packages/core/logger/transport.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5395bc416241c2f925352b3b170fb007bd4f3c0a8368af4de5043154197a0761
language: typescript
---
`packages/core/logger/transport.ts` (lines 1–20)

```typescript
import type { Level, Options } from "./options.js";

export type TransportBuilder = (minLevel: Level, options: Options) => Transport;
/**
 * An interface for the logger `Transport`.
 */
export interface Transport {
  /** INSANE message */
  insane(levelAndName: readonly [Level, string], _strings: TemplateStringsArray, _data: unknown[]): void;
  /** TRACE message */
  trace(levelAndName: readonly [Level, string], strings: TemplateStringsArray, data: unknown[]): void;
  /** DEBUG/LOG message */
  log(levelAndName: readonly [Level, string], strings: TemplateStringsArray, data: unknown[]): void;
  /** INFO message */
  info(levelAndName: readonly [Level, string], strings: TemplateStringsArray, data: unknown[]): void;
  /** WARN message */
  warn(levelAndName: readonly [Level, string], strings: TemplateStringsArray, data: unknown[]): void;
  /** ERROR message */
  error(levelAndName: readonly [Level, string], strings: TemplateStringsArray, data: unknown[]): void;
}
```
