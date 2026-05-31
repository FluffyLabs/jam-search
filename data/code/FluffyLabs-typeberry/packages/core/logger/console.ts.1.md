---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/logger/console.ts#L115-L163
title: packages/core/logger/console.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 6c6b13da4b46cea567f1f150f11cbb42011364436660dea9b36517299f97a0fe
language: typescript
---
`packages/core/logger/console.ts` (lines 115–163)

```typescript
    print(Level.LOG, levelAndName, strings, data);
  }

  info(levelAndName: readonly [Level, string], strings: TemplateStringsArray, data: unknown[]) {
    print(Level.INFO, levelAndName, strings, data);
  }
}

/**
 * An optimized version of the logger - completely ignores `TRACE` level calls.
 */
class LogConsoleTransport extends ConsoleTransport {
  insane(_levelAndName: readonly [Level, string], _strings: TemplateStringsArray, _data: unknown[]) {
    /* no-op */
  }

  trace(_levelAndName: readonly [Level, string], _strings: TemplateStringsArray, _data: unknown[]) {
    /* no-op */
  }

  log(levelAndName: readonly [Level, string], strings: TemplateStringsArray, data: unknown[]) {
    print(Level.LOG, levelAndName, strings, data);
  }

  info(levelAndName: readonly [Level, string], strings: TemplateStringsArray, data: unknown[]) {
    print(Level.INFO, levelAndName, strings, data);
  }
}

/**
 * An optimized version of the logger - completely ignores `TRACE` & `DEBUG` level calls.
 */
class InfoConsoleTransport extends ConsoleTransport {
  insane(_levelAndName: readonly [Level, string], _strings: TemplateStringsArray, _data: unknown[]) {
    /* no-op */
  }

  trace(_levelAndName: readonly [Level, string], _strings: TemplateStringsArray, _data: unknown[]) {
    /* no-op */
  }

  log(_levelAndName: readonly [Level, string], _strings: TemplateStringsArray, _data: unknown[]) {
    /* no-op */
  }

  info(levelAndName: readonly [Level, string], strings: TemplateStringsArray, data: unknown[]) {
    print(Level.INFO, levelAndName, strings, data);
  }
}
```
