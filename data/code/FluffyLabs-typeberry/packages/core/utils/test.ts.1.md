---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/test.ts#L108-L236
title: packages/core/utils/test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: 18256ee7248525e7dcdd407858db07aaa8716048a0907e44fd3ee3e4a74e7d12
language: typescript
---
`packages/core/utils/test.ts` (lines 108–236)

```typescript
      }, ctx);
    }

    if (!actual.isOk && expected.isOk) {
      errors.tryAndCatch(() => {
        throw new Error(`Expected OK, Got ERROR: ${actual.error}: ${actual.details}`);
      }, ctx);
    }

    if (actual.isOk && expected.isOk) {
      deepEqual(actual.ok, expected.ok, { context: ctx.concat(["ok"]), errorsCollector: errors, ignore });
    }

    if (actual.isError && expected.isError) {
      deepEqual(actual.error, expected.error, { context: ctx.concat(["error"]), errorsCollector: errors, ignore });
      deepEqual(actual.details(), expected.details(), {
        context: ctx.concat(["details"]),
        errorsCollector: errors,
        // display details when error does not match
        ignore: actual.error === expected.error ? ignore : [],
      });
    }
    return errors.exitOrThrow();
  }

  if (Array.isArray(actual) && Array.isArray(expected)) {
    errors.tryAndCatch(() => {
      if (actual.length !== expected.length) {
        throw new Error(`Invalid array length: ${actual.length} !== ${expected.length} ${ctx.join(".")}`);
      }
    }, ctx);

    const len = Math.max(actual.length, expected.length);
    for (let i = 0; i < len; i++) {
      deepEqual(actual[i], expected[i], { context: ctx.concat([`[${i}]`]), errorsCollector: errors, ignore });
    }
    return errors.exitOrThrow();
  }

  // special casing for maps
  if (actual instanceof Map && expected instanceof Map) {
    const toArray = (input: Map<unknown, unknown>): Array<{ key: unknown; value: unknown }> => {
      return Array.from(input.entries())
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => {
          const aKey = `${a.key}`;
          const bKey = `${b.key}`;

          if (aKey < bKey) {
            return -1;
          }
          if (bKey < aKey) {
            return 1;
          }
          return 0;
        });
    };

    deepEqual(toArray(actual), toArray(expected), {
      context: ctx.concat(["[map]"]),
      errorsCollector: errors,
      ignore,
    });
    return errors.exitOrThrow();
  }

  if (typeof actual === "object" && typeof expected === "object") {
    const actualKeys = Object.keys(actual) as (keyof T)[];
    const expectedKeys = Object.keys(expected) as (keyof T)[];
    actualKeys.sort();
    expectedKeys.sort();

    const allKeys = getAllKeysSorted<T>(actualKeys, expectedKeys);
    for (const key of allKeys) {
      deepEqual(actual[key], expected[key], { context: ctx.concat([String(key)]), errorsCollector: errors, ignore });
    }

    deepEqual(actualKeys, expectedKeys, { context: ctx.concat(["[keys]"]), errorsCollector: errors, ignore });
    return errors.exitOrThrow();
  }

  errors.tryAndCatch(() => {
    // fallback
    assert.strictEqual(actual, expected);
  }, ctx);

  return errors.exitOrThrow();
}

function getAllKeysSorted<T>(a: (keyof T)[], b: (keyof T)[]): (keyof T)[] {
  const all = new Set(a.concat(b));
  return Array.from(all).sort();
}

/** Attempt to invoke assertions and catch any errors. */
export class ErrorsCollector {
  readonly errors: { context: string[]; e: unknown }[] = [];
  private nested = 0;

  /** We are going into a nested context, so calling `exitOrThrow` will not throw. */
  enter() {
    this.nested += 1;
  }

  /** Execute the closure and catch any errors that may occur. */
  tryAndCatch(cb: () => void, context: string[]) {
    try {
      cb();
    } catch (e) {
      this.errors.push({ context, e });
    }
  }

  /** Exit the previously entered nested context or throw collected errors if we are in top-level context. */
  exitOrThrow() {
    this.nested -= 1;

    // don't throw any errors if we are just collecting errors from a nested context.
    if (this.nested > 0) {
      return this;
    }

    if (this.errors.length === 0) {
      return this;
    }

    const addContext = (e: unknown, context: string[]) => {
      const preamble = `❌  DATA MISMATCH @ ${context.join(".")}\n`;
      if (e instanceof Error) {
```
