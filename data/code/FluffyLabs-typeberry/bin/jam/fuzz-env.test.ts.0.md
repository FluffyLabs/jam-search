---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/fuzz-env.test.ts#L1-L147
title: bin/jam/fuzz-env.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 1946aa9aa7052ff42b9bc2a10ab6a2ad5eeb403da2a981b3903f851da1431653
language: typescript
---
`bin/jam/fuzz-env.test.ts` (lines 1–147)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { KnownChainSpec, NODE_DEFAULTS } from "@typeberry/config-node";
import { Level } from "@typeberry/logger";
import { Command } from "./args.js";
import {
  fuzzDatabaseBasePath,
  JAM_FUZZ,
  JAM_FUZZ_DATA_PATH,
  JAM_FUZZ_LOG_LEVEL,
  JAM_FUZZ_SOCK_PATH,
  JAM_FUZZ_SPEC,
  readFuzzEnv,
  synthesizeFuzzArgs,
} from "./fuzz-env.js";

describe("readFuzzEnv", () => {
  it("returns null when JAM_FUZZ is unset", () => {
    assert.strictEqual(readFuzzEnv({}), null);
  });

  it("returns null when JAM_FUZZ is empty string", () => {
    assert.strictEqual(readFuzzEnv({ [JAM_FUZZ]: "" }), null);
  });

  it("parses tiny spec happy path", () => {
    const result = readFuzzEnv({
      [JAM_FUZZ]: "1",
      [JAM_FUZZ_SPEC]: "tiny",
      [JAM_FUZZ_SOCK_PATH]: "/tmp/jam.sock",
      [JAM_FUZZ_DATA_PATH]: "/tmp/jam-data",
    });

    assert.deepStrictEqual(result, {
      spec: KnownChainSpec.Tiny,
      socketPath: "/tmp/jam.sock",
      dataPath: "/tmp/jam-data",
      logLevel: null,
    });
  });

  it("parses full spec happy path", () => {
    const result = readFuzzEnv({
      [JAM_FUZZ]: "1",
      [JAM_FUZZ_SPEC]: "full",
      [JAM_FUZZ_SOCK_PATH]: "/tmp/jam.sock",
      [JAM_FUZZ_DATA_PATH]: "/tmp/jam-data",
    });

    assert.strictEqual(result?.spec, KnownChainSpec.Full);
  });

  it("rejects missing JAM_FUZZ_SPEC", () => {
    assert.throws(
      () =>
        readFuzzEnv({
          [JAM_FUZZ]: "1",
          [JAM_FUZZ_SOCK_PATH]: "/tmp/s",
          [JAM_FUZZ_DATA_PATH]: "/tmp/d",
        }),
      new RegExp(`${JAM_FUZZ_SPEC} is required`),
    );
  });

  it("rejects missing JAM_FUZZ_SOCK_PATH", () => {
    assert.throws(
      () =>
        readFuzzEnv({
          [JAM_FUZZ]: "1",
          [JAM_FUZZ_SPEC]: "tiny",
          [JAM_FUZZ_DATA_PATH]: "/tmp/d",
        }),
      new RegExp(`${JAM_FUZZ_SOCK_PATH} is required`),
    );
  });

  it("allows missing JAM_FUZZ_DATA_PATH (defaults to in-memory)", () => {
    const result = readFuzzEnv({
      [JAM_FUZZ]: "1",
      [JAM_FUZZ_SPEC]: "tiny",
      [JAM_FUZZ_SOCK_PATH]: "/tmp/s",
    });
    assert.strictEqual(result?.dataPath, "");
  });

  it("rejects empty JAM_FUZZ_SOCK_PATH", () => {
    assert.throws(
      () =>
        readFuzzEnv({
          [JAM_FUZZ]: "1",
          [JAM_FUZZ_SPEC]: "tiny",
          [JAM_FUZZ_SOCK_PATH]: "",
          [JAM_FUZZ_DATA_PATH]: "/tmp/d",
        }),
      new RegExp(`${JAM_FUZZ_SOCK_PATH} is required`),
    );
  });

  it("rejects bogus JAM_FUZZ_SPEC", () => {
    assert.throws(
      () =>
        readFuzzEnv({
          [JAM_FUZZ]: "1",
          [JAM_FUZZ_SPEC]: "huge",
          [JAM_FUZZ_SOCK_PATH]: "/tmp/s",
          [JAM_FUZZ_DATA_PATH]: "/tmp/d",
        }),
      new RegExp(`${JAM_FUZZ_SPEC} must be one of: tiny, full`),
    );
  });

  it("parses JAM_FUZZ_LOG_LEVEL=debug as Level.LOG", () => {
    const result = readFuzzEnv({
      [JAM_FUZZ]: "1",
      [JAM_FUZZ_SPEC]: "tiny",
      [JAM_FUZZ_SOCK_PATH]: "/tmp/s",
      [JAM_FUZZ_DATA_PATH]: "/tmp/d",
      [JAM_FUZZ_LOG_LEVEL]: "debug",
    });
    assert.strictEqual(result?.logLevel, Level.LOG);
  });

  it("parses JAM_FUZZ_LOG_LEVEL=TRACE case-insensitively", () => {
    const result = readFuzzEnv({
      [JAM_FUZZ]: "1",
      [JAM_FUZZ_SPEC]: "tiny",
      [JAM_FUZZ_SOCK_PATH]: "/tmp/s",
      [JAM_FUZZ_DATA_PATH]: "/tmp/d",
      [JAM_FUZZ_LOG_LEVEL]: "TRACE",
    });
    assert.strictEqual(result?.logLevel, Level.TRACE);
  });

  it("parses each documented log level", () => {
    const cases: [string, Level][] = [
      ["error", Level.ERROR],
      ["warn", Level.WARN],
      ["info", Level.INFO],
      ["debug", Level.LOG],
      ["trace", Level.TRACE],
    ];
    for (const [raw, expected] of cases) {
      const result = readFuzzEnv({
        [JAM_FUZZ]: "1",
        [JAM_FUZZ_SPEC]: "tiny",
        [JAM_FUZZ_SOCK_PATH]: "/tmp/s",
        [JAM_FUZZ_DATA_PATH]: "/tmp/d",
```
