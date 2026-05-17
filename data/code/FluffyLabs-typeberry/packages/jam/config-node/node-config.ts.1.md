---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/node-config.ts#L119-L219
title: packages/jam/config-node/node-config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: ac3f9fefd48765b13bebde028d7c86ecf5f6afde4d3a37d711db2c302c9663db
language: typescript
---
`packages/jam/config-node/node-config.ts` (lines 119–219)

```typescript
    const parsed = parseFromJson(mergedJson, NodeConfiguration.fromJson);
    logger.log`🔧 Config ready`;
    return parsed;
  } catch (e) {
    throw new Error(`Unable to parse config: ${e}`);
  }
}

function deepMerge(target: AnyJsonObject, source: JsonValue): void {
  if (!isJsonObject(source)) {
    throw new Error(`Expected object, got ${source}`);
  }
  for (const key in source) {
    if (isJsonObject(source[key])) {
      if (!isJsonObject(target[key])) {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

/**
 * Caution: updates input directly.
 * Processes a pseudo-jq query. Syntax:
 * .path.to.value = { ... } - updates value with the specified object by replacement
 * .path.to.value += { ... } - updates value with the specified object by merging
 * .path.to.value = file.json - updates value with the contents of file.json
 * .path.to.value += file.json - merges the contents of file.json onto value
 */
function processQuery(input: AnyJsonObject, query: string, withRelPath: (p: string) => string): void {
  const queryParts = query.split("=");

  if (queryParts.length === 2) {
    let [path, value] = queryParts.map((part) => part.trim());
    let merge = false;

    // detect += syntax
    if (path.endsWith("+")) {
      merge = true;
      path = path.slice(0, -1);
    }

    let parsedValue: JsonValue;
    if (value.endsWith(".json")) {
      try {
        const configFile = fs.readFileSync(withRelPath(value), "utf8");
        const parsed = JSON.parse(configFile);
        parsedValue = parsed;
      } catch (e) {
        throw new Error(`Unable to load config from ${value}: ${e}`);
      }
    } else {
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        throw new Error(`Unrecognized syntax '${value}': ${e}`);
      }
    }

    let pathParts = path.split(".");

    // allow leading dot in path
    if (pathParts[0] === "") {
      pathParts = pathParts.slice(1);
    }

    let target = input;
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (!isJsonObject(target[part])) {
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
