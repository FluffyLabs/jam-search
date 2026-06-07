---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/main.ts#L266-L283
title: bin/convert/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 3
content_sha: d2e9af7b32e4336b49fd9b175b67bc6411c27e080f2aa81b5cdd20d6d096d264
language: typescript
---
`bin/convert/main.ts` (lines 266–283)

```typescript
    data = Decoder.decodeObject(decoder, input.data, spec);
  } else if (input.type === "json") {
    if (decodeType.json === undefined) {
      throw new Error(`${decodeType.name} does not support reading from JSON.`);
    }
    data = parseFromJson(input.data, decodeType.json(spec));
  } else {
    assertNever(input);
  }

  const { processed, type } = processOutput(spec, await blake2b, data, decodeType, process);

  return {
    processed,
    type,
    spec,
  };
}
```
