---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/logger/options.test.ts#L1-L119
title: packages/core/logger/options.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4e4a0e87562bf84d4725e83fcc378eca5b82ef7dc7af424a8cec23bffd5dc4f9
language: typescript
---
`packages/core/logger/options.test.ts` (lines 1–119)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { findLevel, Level, parseLoggerOptions } from "./options.js";

describe("Options.findLevel", () => {
  it("should return default level when nothing is present", () => {
    const expectedLevel = findLevel(
      {
        defaultLevel: Level.TRACE,
        workingDir: ".",
        modules: new Map(),
      },
      "consensus/voting",
    );

    assert.strictEqual(expectedLevel, Level.TRACE);
  });

  it("should return specialized level", () => {
    const modules = new Map<string, Level>();
    modules.set("consensus/voting", Level.WARN);
    const expectedLevel = findLevel(
      {
        defaultLevel: Level.TRACE,
        workingDir: ".",
        modules,
      },
      "consensus/voting",
    );

    assert.strictEqual(expectedLevel, Level.WARN);
  });

  it("should return specialized level when parent is defined", () => {
    const modules = new Map<string, Level>();
    modules.set("consensus", Level.ERROR);
    const expectedLevel = findLevel(
      {
        defaultLevel: Level.TRACE,
        workingDir: ".",
        modules,
      },
      "consensus/voting",
    );

    assert.strictEqual(expectedLevel, Level.ERROR);
  });
});

describe("Options.parseLoggerOptions", () => {
  it("parse default level and disregard case and whitespace", () => {
    const modules = new Map<string, Level>();
    const expectedOptions = {
      defaultLevel: Level.INFO,
      workingDir: ".",
      modules,
    };

    // when
    const parsedOptions = parseLoggerOptions("InFO ", Level.LOG);
    expectedOptions.workingDir = parsedOptions.workingDir;

    // then
    assert.deepStrictEqual(expectedOptions, parsedOptions);
  });

  it("should return specialized level when parent is defined", () => {
    const modules = new Map<string, Level>();
    modules.set("consensus", Level.ERROR);
    const expectedOptions = {
      defaultLevel: Level.TRACE,
      workingDir: ".",
      modules,
    };

    // when
    const parsedOptions = parseLoggerOptions("trace,consensus=error", Level.WARN);
    expectedOptions.workingDir = parsedOptions.workingDir;

    // then
    assert.deepStrictEqual(expectedOptions, parsedOptions);
  });

  it("should parse more complicated case", () => {
    const modules = new Map<string, Level>();
    modules.set("consensus", Level.ERROR);
    modules.set("consensus/voting", Level.TRACE);
    const expectedOptions = {
      defaultLevel: Level.LOG,
      workingDir: ".",
      modules,
    };

    // when
    const parsedOptions = parseLoggerOptions("consensus=error , consensus/voting = TRACE, debug", Level.WARN);
    expectedOptions.workingDir = parsedOptions.workingDir;

    // then
    assert.deepStrictEqual(expectedOptions, parsedOptions);
  });

  it("should use a default logging level", () => {
    const modules = new Map<string, Level>();
    modules.set("consensus", Level.ERROR);
    modules.set("consensus/voting", Level.TRACE);
    const expectedOptions = {
      defaultLevel: Level.LOG,
      workingDir: ".",
      modules,
    };

    // when
    const parsedOptions = parseLoggerOptions("consensus=error , consensus/voting = TRACE,", Level.LOG);
    expectedOptions.workingDir = parsedOptions.workingDir;

    // then
    assert.deepStrictEqual(expectedOptions, parsedOptions);
  });
});
```
