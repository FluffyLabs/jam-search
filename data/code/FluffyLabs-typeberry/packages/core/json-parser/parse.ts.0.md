---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/json-parser/parse.ts#L1-L126
title: packages/core/json-parser/parse.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 2
content_sha: ddf6c500a0b4a7bd9f44733adebf2679c7626d774f328ab6fe7c730c1e58c544
language: typescript
---
`packages/core/json-parser/parse.ts` (lines 1–126)

```typescript
import type { FromJson, Parser } from "./types.js";

const NO_KEY: unique symbol = Symbol("no key");

/** Given already parsed JSON, parse & validate it further to match the expected `jsonDescription` type. */
export function parseFromJson<T>(jsonType: unknown, jsonDescription: FromJson<T>, context = "<root>"): T {
  const t = typeof jsonType;

  if (jsonDescription === "string") {
    if (t === "string") {
      return jsonType as T;
    }
    throw new Error(`[${context}] Expected ${jsonDescription} but got ${t}`);
  }

  if (jsonDescription === "number") {
    if (t === "number") {
      return jsonType as T;
    }
    throw new Error(`[${context}] Expected ${jsonDescription} but got ${t}`);
  }

  if (jsonDescription === "boolean") {
    if (t === "boolean") {
      return jsonType as T;
    }
    throw new Error(`[${context}] Expected ${jsonDescription} but got ${t}`);
  }

  if (Array.isArray(jsonDescription)) {
    const type = jsonDescription[0];

    // an array type
    if (type === "array") {
      const expectedType = jsonDescription[1];

      if (typeof expectedType === "function") {
        return expectedType(jsonType, context) as T;
      }

      if (!Array.isArray(jsonType)) {
        throw new Error(`[${context}] Expected array, got ${jsonType}`);
      }

      const arr = jsonType as unknown[];
      const result = [] as unknown[];
      for (const [k, v] of arr.entries()) {
        result[k] = parseFromJson(v, expectedType, `${context}.${k}`);
      }
      return result as T;
    }

    // optional type
    if (type === "optional") {
      if (jsonType === undefined || jsonType === null) {
        return jsonType as T;
      }

      const expectedType = jsonDescription[1];
      return parseFromJson(jsonType, expectedType, context);
    }

    // a manual parser for nested object
    if (type === "object") {
      const parser = jsonDescription[1];
      const obj = jsonType as object;
      return parseOrThrow(parser, obj, context);
    }

    // An expected in-json type and the parser to the destination type.
    if (type === "string") {
      const parser = jsonDescription[1];
      const value = parseFromJson<string>(jsonType, type, context);
      return parseOrThrow(parser, value, context);
    }

    if (type === "number") {
      const type = jsonDescription[0];
      const parser = jsonDescription[1];
      const value = parseFromJson<number>(jsonType, type, context);
      return parseOrThrow(parser, value, context);
    }

    throw new Error(`[${context}] Invalid parser type: ${type}`);
  }

  if (t !== "object") {
    throw new Error(`[${context}] Expected complex type but got ${t}`);
  }

  if (typeof jsonDescription !== "object") {
    throw new Error(`[${context}] Unhandled type ${jsonDescription}`);
  }

  if (jsonType === null) {
    throw new Error(`[${context}] Unexpected 'null'`);
  }

  const result = {} as { [key: string]: unknown };
  const obj = jsonType as { [key: string]: unknown };
  const c = jsonDescription as { [key: string]: FromJson<unknown> };

  // add all keys so that they are in the same order.
  for (const key of Object.keys(obj)) {
    result[key] = undefined;
  }

  // now parse the ones that we need (some might be optional, but that's fine).
  for (const key of Object.keys(jsonDescription)) {
    // we intentionally skip missing keys, to have them detected
    // during key diffing. But for optional keys we put NO_KEY value
    // to make sure key diffing works fine.
    if (key in obj) {
      const v = obj[key];
      result[key] = parseFromJson(v, c[key], `${context}.${key}`);
    } else if (Array.isArray(c[key]) && c[key][0] === "optional") {
      result[key] = NO_KEY;
    }
  }

  // compute the key difference
  const keysDifference = diffKeys(result, jsonDescription);
  if (keysDifference.length > 0) {
    const e = new Error(
      `[${context}] Unexpected or missing keys: ${keysDifference.join(" | ")}
          Data: ${Object.keys(result)}
```
