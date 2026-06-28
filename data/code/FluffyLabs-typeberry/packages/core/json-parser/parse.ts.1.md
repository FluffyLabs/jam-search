---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/json-parser/parse.ts#L122-L177
title: packages/core/json-parser/parse.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 403c323bd83ee0cfd6fb3ea0d39f2ca50eca7855a1bfc9d1ef28cbc38bf77bb9
language: typescript
---
`packages/core/json-parser/parse.ts` (lines 122–177)

```typescript
  const keysDifference = diffKeys(result, jsonDescription);
  if (keysDifference.length > 0) {
    const e = new Error(
      `[${context}] Unexpected or missing keys: ${keysDifference.join(" | ")}
          Data: ${Object.keys(result)}
          Schema: ${Object.keys(jsonDescription)}`,
    );
    throw e;
  }

  // clean up keys with no value
  for (const key of Object.keys(result)) {
    if (result[key] === NO_KEY) {
      delete result[key];
    }
  }

  return result as T;
}

function diffKeys(obj1: object, obj2: object): [string, string][] {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  keys1.sort();
  keys2.sort();

  const keysCounter: { [key: string]: number } = {};
  const max = Math.max(keys2.length, keys2.length);

  const KEY1_SET = 1;
  const KEY2_SET = 2;

  for (let i = 0; i < max; i++) {
    keysCounter[keys1[i]] = (keysCounter[keys1[i]] || 0) + KEY1_SET;
    keysCounter[keys2[i]] = (keysCounter[keys2[i]] || 0) + KEY2_SET;
  }

  const diff: [string, string][] = [];
  const id = (v?: string) => (v !== undefined ? `"${v}"` : "<missing>");
  for (const [k, v] of Object.entries(keysCounter)) {
    if (v !== KEY1_SET + KEY2_SET && k !== "undefined") {
      diff.push(v === KEY1_SET ? [id(k), id(undefined)] : [id(undefined), id(k)]);
    }
  }

  return diff;
}

function parseOrThrow<T, X>(parser: Parser<X, T>, value: X, context: string): T {
  try {
    return parser(value, context);
  } catch (e) {
    throw new Error(`[${context}] Error while parsing the value: ${e}`);
  }
}
```
