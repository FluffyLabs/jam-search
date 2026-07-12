---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/test.ts#L1-L116
title: packages/core/utils/test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 1c9375946b5e219c96152743965cddcfcb96969500f53400ad0cd39a555fd443
language: typescript
---
`packages/core/utils/test.ts` (lines 1–116)

```typescript
/**
 * Utilities for tests.
 */
import assert from "node:assert";
import { inspect } from "./debug.js";
import type { Result } from "./result.js";

/**
 * If some object has this property set, it can override how it's being compared
 * using [`deepEqual`].
 * The value under that symbol should be a function to be invoked by `deepEqual`.
 * Returned values will then be further compared recursively.
 */
export const TEST_COMPARE_USING: unique symbol = Symbol("compare using");

function callCompareFunction(object: unknown) {
  if (object !== null && typeof object === "object" && TEST_COMPARE_USING in object) {
    if (typeof object[TEST_COMPARE_USING] !== "function") {
      throw new Error(`${String(TEST_COMPARE_USING)} of ${object} is not a function!`);
    }
    return object[TEST_COMPARE_USING]();
  }

  return object;
}

/** Equality comparison options. */
export type DeepEqualOptions = {
  /** Initial context, i.e. name of the variable we are comparing. */
  context?: string | string[];
  /** A list of ignored paths (for instance `result.details`). */
  ignore?: string[];
  /**
   * Optional shared errors collector.
   * It can be used to run multiple assertions instead of failing on the first one.
   */
  errorsCollector?: ErrorsCollector;
};

let oomWarningPrinted = false;

/** Deeply compare `actual` and `expected` values. */
export function deepEqual<T>(
  actual: T | undefined,
  expected: T | undefined,
  { context = [], errorsCollector, ignore = [] }: DeepEqualOptions = {},
) {
  const ctx = Array.isArray(context) ? context : [context];
  const errors = errorsCollector ?? new ErrorsCollector();

  // ignore a field if it's on ignore list.
  if (ignore.includes(ctx.join("."))) {
    return;
  }

  errors.enter();

  if (actual === null || expected === null || actual === undefined || expected === undefined) {
    errors.tryAndCatch(() => {
      /**
       * There is a problem with memory in node 22.12.0+
       *
       * This workaround can be removed when this issue is resolved: https://github.com/nodejs/node/issues/57242
       */
      const [major, minor] = process.versions.node.split(".").map(Number);
      const isOoMWorkaroundNeeded = major > 22 || (major === 22 && minor >= 12);
      const message = isOoMWorkaroundNeeded ? new Error(`${actual} != ${expected}`) : undefined;
      const actualDisp = actual === null || actual === undefined ? actual : `${inspect(actual)}`;
      const expectedDisp = expected === null || expected === undefined ? expected : `${inspect(expected)}`;

      try {
        assert.strictEqual(actualDisp, expectedDisp, message);
      } catch (e) {
        if (isOoMWorkaroundNeeded && !oomWarningPrinted) {
          // biome-ignore lint/suspicious/noConsole: warning
          console.warn(
            [
              "Stacktrace may be crappy because of a problem in nodejs.",
              "Use older version than 22.12.0 or check this issue: https://github.com/nodejs/node/issues/57242",
              "Maybe we do not need it anymore",
            ].join("\n"),
          );
          oomWarningPrinted = true;
        }
        throw e;
      }
    }, ctx);
    return errors.exitOrThrow();
  }

  // special casing for customized comparison
  if (
    (typeof actual === "object" && TEST_COMPARE_USING in actual) ||
    (typeof expected === "object" && TEST_COMPARE_USING in expected)
  ) {
    deepEqual(callCompareFunction(actual), callCompareFunction(expected), {
      context: ctx,
      errorsCollector: errors,
      ignore,
    });
    return errors.exitOrThrow();
  }

  if (isResult(actual) && isResult(expected)) {
    if (actual.isOk && !expected.isOk) {
      errors.tryAndCatch(() => {
        throw new Error(`Got OK, expected ERROR: ${expected.error}: ${expected.details}`);
      }, ctx);
    }

    if (!actual.isOk && expected.isOk) {
      errors.tryAndCatch(() => {
        throw new Error(`Expected OK, Got ERROR: ${actual.error}: ${actual.details}`);
      }, ctx);
    }

```
