---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/args.test.ts#L1-L147
title: bin/convert/args.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 8855f16d6bb35be3af8931fce965dfdf96f0571aa3743c6fe573da1bbc68e7bb
language: typescript
---
`bin/convert/args.test.ts` (lines 1–147)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { KnownChainSpec, OutputFormat, parseArgs } from "./args.js";
import { SUPPORTED_TYPES } from "./types.js";

const anyType = SUPPORTED_TYPES[0];
const headerType = SUPPORTED_TYPES.find(({ name }) => name === "header") ?? anyType;
const stateDumpType = SUPPORTED_TYPES.find(({ name }) => name === "state-dump") ?? anyType;

describe("CLI", () => {
  const parse = (args: string[]) => parseArgs(args, (v) => `../${v}`);
  const defaultArgs = {
    process: "",
    flavor: KnownChainSpec.Tiny,
    outputFormat: OutputFormat.Print,
    destination: null,
  };

  it("should parse chain spec option", () => {
    const args = parse(["--flavor=full", "./test.hex", "header"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      flavor: KnownChainSpec.Full,
      type: headerType,
      inputPath: ".././test.hex",
    });
  });

  it("should parse bin file", () => {
    const args = parse(["./test.bin", "header"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      type: headerType,
      inputPath: ".././test.bin",
    });
  });

  it("should parse process option alone", () => {
    const args = parse(["./test.hex", "state-dump", "as-root-hash"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      type: stateDumpType,
      inputPath: ".././test.hex",
      process: "as-root-hash",
    });
  });

  it("should parse process option and output", () => {
    const args = parse(["./test.hex", "state-dump", "as-root-hash", "to-hex"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      type: stateDumpType,
      inputPath: ".././test.hex",
      process: "as-root-hash",
      outputFormat: OutputFormat.Hex,
    });
  });

  it("should parse process option, output and destination", () => {
    const args = parse(["./test.hex", "state-dump", "as-root-hash", "to-hex", "./dest.hex"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      type: stateDumpType,
      inputPath: ".././test.hex",
      process: "as-root-hash",
      outputFormat: OutputFormat.Hex,
      destination: "./dest.hex",
    });
  });

  it("should parse defaults", () => {
    const args = parse(["./test.json", "header"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      type: headerType,
      inputPath: ".././test.json",
    });
  });

  it("should parse json output", () => {
    const args = parse(["./test.json", "header", "to-json"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      type: headerType,
      inputPath: ".././test.json",
      outputFormat: OutputFormat.Json,
    });
  });

  it("should parse hex output", () => {
    const args = parse(["./test.json", "header", "to-hex"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      type: headerType,
      inputPath: ".././test.json",
      outputFormat: OutputFormat.Hex,
    });
  });

  it("should parse hex output with destination", () => {
    const args = parse(["./test.json", "header", "to-hex", "./dest.hex"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      type: headerType,
      inputPath: ".././test.json",
      outputFormat: OutputFormat.Hex,
      destination: "./dest.hex",
    });
  });

  it("should parse repl output", () => {
    const args = parse(["./test.json", "header", "to-repl"]);

    assert.deepStrictEqual(args, {
      ...defaultArgs,
      type: headerType,
      inputPath: ".././test.json",
      outputFormat: OutputFormat.Repl,
    });
  });

  it("should throw on bin and no destination", () => {
    assert.throws(
      () => {
        const _args = parse(["./test.bin", "state-dump", "as-root-hash", "to-bin"]);
      },
      {
        message: "to-bin requires destination file",
      },
    );
  });

  it("should throw on repl and destination", () => {
    assert.throws(
      () => {
        const _args = parse(["./test.bin", "state-dump", "as-root-hash", "to-repl", "./test.js"]);
      },
```
