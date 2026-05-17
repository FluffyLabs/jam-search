---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/fuzz-env.test.ts#L142-L205
title: bin/jam/fuzz-env.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: c856d32105157ad4a6dc9b008049b537a42d82f79af611ffa78cc6b965562f54
language: typescript
---
`bin/jam/fuzz-env.test.ts` (lines 142–205)

```typescript
      ["trace", Level.TRACE],
    ];
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
      dataPath: "/tmp/jam-data",
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
      dataPath: "/tmp/jam-data",
      logLevel: null,
    });
    if (args.command !== Command.FuzzTarget) {
      throw new Error("expected FuzzTarget command");
    }
    assert.deepStrictEqual(args.args.config, [...NODE_DEFAULTS.config, '.flavor="full"']);
  });
});
```
