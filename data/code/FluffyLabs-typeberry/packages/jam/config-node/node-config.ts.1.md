---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/node-config.ts#L123-L252
title: packages/jam/config-node/node-config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 8a571b8df14f49de6fda86989d88487cae5825fa8bae8a2f407f15eed0f12411
language: typescript
---
`packages/jam/config-node/node-config.ts` (lines 123–252)

```typescript
export function loadConfig(config: string[], withRelPath: (p: string) => string): NodeConfiguration {
  logger.log`🔧 Loading config`;
  let mergedJson: AnyJsonObject = {};

  for (const entry of config) {
    logger.log`🔧 Applying '${entry}'`;

    if (entry === DEV_TINY_CONFIG) {
      mergedJson = structuredClone(configs.devTiny); // clone to avoid mutating the original config. not doing a merge since dev and default should theoretically replace all properties.
      continue;
    }

    if (entry === DEV_FULL_CONFIG) {
      mergedJson = structuredClone(configs.devFull); // clone to avoid mutating the original config. not doing a merge since dev and default should theoretically replace all properties.
      continue;
    }

    if (entry === DEFAULT_CONFIG) {
      mergedJson = structuredClone(configs.default);
      continue;
    }

    // try to parse as JSON
    try {
      const parsed = JSON.parse(entry);
      deepMerge(mergedJson, parsed);
      continue;
    } catch {}

    // if not, try to load as file
    if (entry.indexOf("=") === -1 && entry.endsWith(".json")) {
      try {
        const configFile = fs.readFileSync(withRelPath(entry), "utf8");
        const parsed = JSON.parse(configFile);
        deepMerge(mergedJson, parsed);
      } catch (e) {
        throw new Error(`Unable to load config from ${entry}: ${e}`);
      }
    } else {
      // finally try to process as a pseudo-jq query
      try {
        processQuery(mergedJson, entry, withRelPath);
      } catch (e) {
        throw new Error(`Error while processing '${entry}': ${e}`);
      }
    }
  }

  try {
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
```
