---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/json-parser/types.ts#L1-L42
title: packages/core/json-parser/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 42afb660b83f0158acbaee438a927ce56168b7a533b5500cba0fc9c6c0fa3c1b
language: typescript
---
`packages/core/json-parser/types.ts` (lines 1–42)

```typescript
/** A type that can be read from a JSON-parsed object. */
// biome-ignore lint/suspicious/noRedeclare: Biome seems to incorrectly think that the second part of the union is re-declaration. I'm not sure, but it does work so 🤷.
export type FromJson<T> = T extends (infer U)[] | readonly (infer U)[]
  ? ["array", FromJson<U> | Parser<unknown, U[]>]
  : // parse a string from JSON into expected type
      | FromJsonWithParser<string, T>
      // parse a number from JSON into expected type
      | FromJsonWithParser<number, T>
      // manually parse a nested object
      | FromJsonWithParser<unknown, T>
      | FromJsonPrimitive<T>
      | FromJsonOptional<T>;

/** Parsing a JSON primitive value. */
export type FromJsonPrimitive<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends object
        ? ObjectFromJson<T>
        : T extends unknown
          ? "object"
          : never;

/** Conversion from some JSON type into the expected type. */
export type Parser<TFrom, TInto> = (inJson: TFrom, context?: string) => TInto;

/** Parsing a JSON value with given convesion. */
export type FromJsonWithParser<TFrom, TInto> = [FromJsonPrimitive<TFrom>, Parser<TFrom, TInto>];

/** A potentially optional JSON parameter (key/value undefined). */
export type FromJsonOptional<TInto> = ["optional", FromJson<TInto>];

/** A composite JSON object. */
export type ObjectFromJson<T> = {
  [K in keyof T]: FromJson<T[K]>;
};

/** Builder function that converts an object parsed from JSON into some expected type of object. */
export type Builder<TFrom, TInto> = (x: TFrom) => TInto;
```
