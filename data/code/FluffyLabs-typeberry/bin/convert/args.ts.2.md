---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/args.ts#L256-L269
title: bin/convert/args.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 2
chunk_total: 3
content_sha: 3b037645e880131c80c6d8a59958acf5d046f25478c018b6d3e1f41e2b5e25b0
language: typescript
---
`bin/convert/args.ts` (lines 256–269)

```typescript
  return { process: defaultProcess, format: defaultFormat, destination };
}

function throwIfDumpNotSupported(format: OutputFormat, destination: string | null) {
  if (destination !== null) {
    if (format === OutputFormat.Print || format === OutputFormat.Repl) {
      throw new Error(`Dumping to file is not supported for ${format}`);
    }
  } else {
    if (format === OutputFormat.Bin) {
      throw new Error(`${format} requires destination file`);
    }
  }
}
```
