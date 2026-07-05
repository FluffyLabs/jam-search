---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/node-config.ts#L245-L272
title: packages/jam/config-node/node-config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 90f7dcc670a2b0eddb1394d80979201f3f2afee22f53af459c9867d5e6328af9
language: typescript
---
`packages/jam/config-node/node-config.ts` (lines 245–272)

```typescript
        target[part] = {};
      }
      if (i === pathParts.length - 1) {
        if (merge) {
          deepMerge(target[part], parsedValue);
        } else {
          target[part] = parsedValue;
        }
        return;
      }
      target = target[part];
    }
  }

  throw new Error("Unrecognized syntax.");
}

type JsonValue = string | number | boolean | null | AnyJsonObject | JsonArray;

interface AnyJsonObject {
  [key: string]: JsonValue;
}

interface JsonArray extends Array<JsonValue> {}

function isJsonObject(value: JsonValue): value is AnyJsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
```
