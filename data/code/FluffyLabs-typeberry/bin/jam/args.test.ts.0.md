---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/args.test.ts#L1-L168'
title: bin/jam/args.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 2
content_sha: d40fe7131ad80816e648f4a954949aed346cc8043c00284ff1209d17c074c954
language: typescript
---
`bin/jam/args.test.ts` (lines 1–168)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { PvmBackend, PvmBackendNames } from "@typeberry/config";
import { NODE_DEFAULTS } from "@typeberry/config-node";
import { tryAsU16 } from "@typeberry/numbers";
import { deepEqual } from "@typeberry/utils";
import { Command, parseArgs, type SharedOptions } from "./args.js";

describe("CLI", () => {
  const parse = (args: string[]) => parseArgs(args, (v) => `../${v}`);
  const defaultOptions: SharedOptions = {
    nodeName: NODE_DEFAULTS.name,
    config: NODE_DEFAULTS.config,
    pvm: NODE_DEFAULTS.pvm,
  };

  it("should start with default arguments", () => {
    const args = parse([]);

    deepEqual(args, {
      command: Command.Run,
      args: defaultOptions,
    });
  });

  it("should parse name option", () => {
    const args = parse(["--name=my silly name"]);

    deepEqual(args, {
      command: Command.Run,
      args: {
        ...defaultOptions,
        nodeName: "my silly name",
      },
    });
  });

  it("should parse single config option as array", () => {
    const args = parse(["--config=./config.json"]);

    deepEqual(args, {
      command: Command.Run,
      args: {
        ...defaultOptions,
        config: ["./config.json"],
      },
    });
  });

  it("should parse dev config option as array", () => {
    const args = parse(["--config=dev"]);

    deepEqual(args, {
      command: Command.Run,
      args: {
        ...defaultOptions,
        config: ["dev"],
      },
    });
  });

  it("should parse multiple config options as array", () => {
    const args = parse(["--config=dev", "--config=./config.json"]);
    deepEqual(args, {
      command: Command.Run,
      args: {
        ...defaultOptions,
        config: ["dev", "./config.json"],
      },
    });
  });

  it("should throw an error when one of config options is not a string", () => {
    assert.throws(
      () => {
        parse(["--config=dev", "--config=1"]);
      },
      {
        message: "Option '--config' requires an argument of type: string, got: number.",
      },
    );
  });

  it("should parse import command and add rel path to files", () => {
    const args = parse(["import", "./file1.json", "./file2.json"]);

    deepEqual(args, {
      command: Command.Import,
      args: {
        ...defaultOptions,
        files: [".././file1.json", ".././file2.json"],
      },
    });
  });

  it("should parse export command and add rel path to output path", () => {
    const args = parse(["export", "./output"]);

    deepEqual(args, {
      command: Command.Export,
      args: {
        ...defaultOptions,
        output: ".././output",
      },
    });
  });

  it("should parse pvm option", () => {
    const args = parse(["--pvm=ananas"]);

    deepEqual(args, {
      command: Command.Run,
      args: {
        ...defaultOptions,
        pvm: PvmBackend.Ananas,
      },
    });
  });

  it("should throw on invalid pvm option", () => {
    const pvms = PvmBackendNames.join(", ");
    assert.throws(
      () => {
        const _args = parse(["--pvm=unimplemented"]);
      },
      {
        message: `Invalid value 'unimplemented' for option 'pvm': Error: Use one of ${pvms}`,
      },
    );
  });

  it("should throw on missing output path", () => {
    assert.throws(
      () => {
        const _args = parse(["export"]);
      },
      {
        message: "Missing output directory.",
      },
    );
  });

  it("should parse dev-validator index", () => {
    const args = parse(["dev", "0xa"]);

    deepEqual(args, {
      command: Command.Dev,
      args: {
        ...defaultOptions,
        config: ["dev"],
        index: tryAsU16(10),
        isFastForward: false,
      },
    });
  });

  it("should throw on unexpected command", () => {
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
```
