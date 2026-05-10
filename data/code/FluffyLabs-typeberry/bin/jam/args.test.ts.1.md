---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/args.test.ts#L158-L278
title: bin/jam/args.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: 566c807a390f173859563f4a697e85b4d01313b6bd22e5ece8b76b423530d11b
language: typescript
---
`bin/jam/args.test.ts` (lines 158–278)

```typescript
    assert.throws(
      () => {
        parse(["unknown"]);
      },
      {
        message: "Unexpected command: 'unknown'",
      },
    );
  });

  it("should throw on missing dev-validator index", () => {
    assert.throws(
      () => {
        const _args = parse(["dev"]);
      },
      {
        message: "Missing dev-validator index.",
      },
    );
  });

  it("should throw on invalid dev-validator index", () => {
    assert.throws(
      () => {
        const _args = parse(["dev", "1.5"]);
      },
      {
        message: 'Invalid dev-validator index: 1.5, need U16 or "all"',
      },
    );
  });

  it("should throw on unexpected options", () => {
    assert.throws(
      () => {
        parse(["run", "--myoption", "x"]);
      },
      {
        message: "Unrecognized options: 'myoption'",
      },
    );
  });

  it("should throw on unexpected run args", () => {
    assert.throws(
      () => {
        parse(["run", "x"]);
      },
      {
        message: "Unexpected command: 'x'",
      },
    );
  });

  it("should throw on unexpected extra args", () => {
    assert.throws(
      () => {
        parse(["run", "--", "x"]);
      },
      {
        message: "Unexpected command: 'x'",
      },
    );
  });

  it("should parse fuzz-target command", () => {
    const args = parse(["fuzz-target"]);

    deepEqual(args, {
      command: Command.FuzzTarget,
      args: {
        ...defaultOptions,
        version: 1,
        socket: null,
        initGenesisFromAncestry: false,
      },
    });
  });

  it("should parse fuzz-target with init-genesis-from-ancestry", () => {
    const args = parse(["fuzz-target", "--init-genesis-from-ancestry"]);

    deepEqual(args, {
      command: Command.FuzzTarget,
      args: {
        ...defaultOptions,
        version: 1,
        socket: null,
        initGenesisFromAncestry: true,
      },
    });
  });

  it("should parse fuzz-target with flags before command", () => {
    const args = parse(["--init-genesis-from-ancestry", "--version=1", "fuzz-target"]);

    deepEqual(args, {
      command: Command.FuzzTarget,
      args: {
        ...defaultOptions,
        version: 1,
        socket: null,
        initGenesisFromAncestry: true,
      },
    });
  });

  it("should parse fuzz-target with flags before command (space separated)", () => {
    const args = parse(["--version", "1", "--init-genesis-from-ancestry", "fuzz-target"]);

    deepEqual(args, {
      command: Command.FuzzTarget,
      args: {
        ...defaultOptions,
        version: 1,
        socket: null,
        initGenesisFromAncestry: true,
      },
    });
  });
});
```
