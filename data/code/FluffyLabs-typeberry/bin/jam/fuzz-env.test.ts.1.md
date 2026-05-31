---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/fuzz-env.test.ts#L142-L235
title: bin/jam/fuzz-env.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 392525ea2df76caacf6765ca6d14508bfdf98b4a328ef36ac53a237748bc1bc3
language: typescript
---
`bin/jam/fuzz-env.test.ts` (lines 142–235)

```typescript
    for (const [raw, expected] of cases) {
      const result = readFuzzEnv({
        [JAM_FUZZ]: "1",
        [JAM_FUZZ_SPEC]: "tiny",
        [JAM_FUZZ_SOCK_PATH]: "/tmp/s",
        [JAM_FUZZ_DATA_PATH]: "/tmp/d",
        [JAM_FUZZ_LOG_LEVEL]: raw,
      });
      assert.strictEqual(result?.logLevel, expected, `level for '${raw}'`);
    }
  });

  it("rejects bogus JAM_FUZZ_LOG_LEVEL", () => {
    assert.throws(
      () =>
        readFuzzEnv({
          [JAM_FUZZ]: "1",
          [JAM_FUZZ_SPEC]: "tiny",
          [JAM_FUZZ_SOCK_PATH]: "/tmp/s",
          [JAM_FUZZ_DATA_PATH]: "/tmp/d",
          [JAM_FUZZ_LOG_LEVEL]: "BOGUS",
        }),
      new RegExp(`${JAM_FUZZ_LOG_LEVEL} must be one of: error, warn, info, debug, trace`),
    );
  });
});

describe("synthesizeFuzzArgs", () => {
  it("builds a FuzzTarget Arguments value with tiny flavor override", () => {
    const args = synthesizeFuzzArgs({
      spec: KnownChainSpec.Tiny,
      socketPath: "/tmp/jam.sock",
      dataPath: "undefined", // in-memory sentinel
      logLevel: null,
    });

    assert.deepStrictEqual(args, {
      command: Command.FuzzTarget,
      args: {
        nodeName: NODE_DEFAULTS.name,
        config: [...NODE_DEFAULTS.config, '.flavor="tiny"'],
        pvm: NODE_DEFAULTS.pvm,
        socket: "/tmp/jam.sock",
        version: 1,
        initGenesisFromAncestry: false,
      },
    });
  });

  it("uses 'full' flavor when spec is full", () => {
    const args = synthesizeFuzzArgs({
      spec: KnownChainSpec.Full,
      socketPath: "/tmp/jam.sock",
      dataPath: "undefined", // in-memory sentinel
      logLevel: null,
    });
    if (args.command !== Command.FuzzTarget) {
      throw new Error("expected FuzzTarget command");
    }
    assert.deepStrictEqual(args.args.config, [...NODE_DEFAULTS.config, '.flavor="full"']);
  });

  it("appends .database_base_path when a real data path is given", () => {
    const args = synthesizeFuzzArgs({
      spec: KnownChainSpec.Tiny,
      socketPath: "/tmp/jam.sock",
      dataPath: "/tmp/jam-data",
      logLevel: null,
    });
    if (args.command !== Command.FuzzTarget) {
      throw new Error("expected FuzzTarget command");
    }
    assert.deepStrictEqual(args.args.config, [
      ...NODE_DEFAULTS.config,
      '.flavor="tiny"',
      '.database_base_path="/tmp/jam-data"',
    ]);
  });
});

describe("fuzzDatabaseBasePath", () => {
  it("returns undefined for empty string", () => {
    assert.strictEqual(fuzzDatabaseBasePath(""), undefined);
  });

  it("returns undefined for the 'undefined' sentinel (case/space insensitive)", () => {
    assert.strictEqual(fuzzDatabaseBasePath("undefined"), undefined);
    assert.strictEqual(fuzzDatabaseBasePath("  UnDeFiNeD  "), undefined);
  });

  it("returns the trimmed path for a real path", () => {
    assert.strictEqual(fuzzDatabaseBasePath("  /tmp/jam-data  "), "/tmp/jam-data");
  });
});
```
