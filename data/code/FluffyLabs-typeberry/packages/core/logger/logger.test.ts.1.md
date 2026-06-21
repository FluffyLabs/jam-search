---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/logger/logger.test.ts#L112-L138
title: packages/core/logger/logger.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: aee280ea7b5911f1ee2460c66467e0593015fdb92b453637bf9256f3d308fc84
language: typescript
---
`packages/core/logger/logger.test.ts` (lines 112–138)

```typescript
    this.calls.push({ level, levelAndName, message: String(strings[0]) });
  }

  insane(levelAndName: readonly [Level, string], strings: TemplateStringsArray) {
    this.appendCall(Level.INSANE, levelAndName, strings);
  }

  trace(levelAndName: readonly [Level, string], strings: TemplateStringsArray) {
    this.appendCall(Level.TRACE, levelAndName, strings);
  }

  log(levelAndName: readonly [Level, string], strings: TemplateStringsArray) {
    this.appendCall(Level.LOG, levelAndName, strings);
  }

  info(levelAndName: readonly [Level, string], strings: TemplateStringsArray) {
    this.appendCall(Level.INFO, levelAndName, strings);
  }

  warn(levelAndName: readonly [Level, string], strings: TemplateStringsArray) {
    this.appendCall(Level.WARN, levelAndName, strings);
  }

  error(levelAndName: readonly [Level, string], strings: TemplateStringsArray) {
    this.appendCall(Level.ERROR, levelAndName, strings);
  }
}
```
