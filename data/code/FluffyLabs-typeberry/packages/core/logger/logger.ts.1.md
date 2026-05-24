---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/logger/logger.ts#L111-L120
title: packages/core/logger/logger.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a4ab2a665c475a5ba9fce43b3366afa2b08c6a9cbdb4b7de7b0538a76278da49
language: typescript
---
`packages/core/logger/logger.ts` (lines 111–120)

```typescript
  /** Log a message with `WARN` level. */
  warn(strings: TemplateStringsArray, ...data: unknown[]) {
    this.config.transport.warn(this.getLevelAndName(), strings, data);
  }

  /** Log a message with `ERROR` level. */
  error(strings: TemplateStringsArray, ...data: unknown[]) {
    this.config.transport.error(this.getLevelAndName(), strings, data);
  }
}
```
