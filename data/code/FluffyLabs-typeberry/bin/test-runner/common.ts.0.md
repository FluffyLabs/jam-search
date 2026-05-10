---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/common.ts#L1-L154
title: bin/test-runner/common.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 4
content_sha: 42c2dc8eb854e1c0d7cccb564d691461f02d7523a0d1e941c42fdc30a2c3c621
language: typescript
---
`bin/test-runner/common.ts` (lines 1–154)

```typescript
import "json-bigint-patch";

import { fail } from "node:assert";
import * as fs from "node:fs/promises";
import path from "node:path";
import test, { type TestContext } from "node:test";
import util from "node:util";
import { type Decode, Decoder } from "@typeberry/codec";
import { type ChainSpec, PvmBackend, tinyChainSpec } from "@typeberry/config";
import { initWasm } from "@typeberry/crypto";
import { type FromJson, parseFromJson } from "@typeberry/json-parser";
import { Level, Logger } from "@typeberry/logger";
import { assertNever } from "@typeberry/utils";
import minimist from "minimist";

Logger.configureAll(process.env.JAM_LOG ?? "", Level.LOG);
export const logger = Logger.new(import.meta.filename, "test-runner");

export enum SelectedPvm {
  Ananas = "ananas",
  Builtin = "builtin",
}
export const ALL_PVMS = [SelectedPvm.Ananas, SelectedPvm.Builtin];
export function selectedPvmToBackend(pvm: SelectedPvm): PvmBackend {
  switch (pvm) {
    case SelectedPvm.Ananas:
      return PvmBackend.Ananas;
    case SelectedPvm.Builtin:
      return PvmBackend.BuiltIn;
    default:
      assertNever(pvm);
  }
}

export type GlobalsOptions = {
  pvms: SelectedPvm[];
  accumulateSequentially: boolean;
};

export class RunnerBuilder<T, V> implements Runner<T, V> {
  public readonly parsers: testFile.Kind<T>[] = [];
  public readonly variants: V[] = [];
  public readonly chainSpecs: ChainSpec[] = [];

  static new<T, V>(path: string, run: RunFunction<T, V>) {
    return new RunnerBuilder<T, V>(path, run);
  }

  private constructor(
    public readonly path: string,
    public readonly run: RunFunction<T, V>,
  ) {}

  fromJson(fromJson: FromJson<T>) {
    this.parsers.push({ kind: testFile.json, fromJson });
    return this;
  }

  fromBin(codec: Decode<T>) {
    this.parsers.push({ kind: testFile.bin, codec });
    return this;
  }

  withChainSpecDetection(chainSpec: ChainSpec[]) {
    this.chainSpecs.push(...chainSpec);
    return this;
  }

  withVariants(variants: V[]) {
    this.variants.push(...variants);
    return this;
  }

  build(): Runner<unknown, unknown> {
    const { path, run, parsers, variants, chainSpecs } = this;
    if (parsers.length === 0) {
      throw new Error(`No parsers for ${path}!`);
    }

    return {
      path,
      run,
      parsers,
      variants,
      chainSpecs,
    } as Runner<unknown, unknown>;
  }
}

/** Test runner builder function. */
export function runner<T, V = never>(path: string, run: RunFunction<T, V>, chainSpecs?: ChainSpec[]) {
  const builder = RunnerBuilder.new(path, run);
  if (chainSpecs !== undefined) {
    return builder.withChainSpecDetection(chainSpecs);
  }
  return builder;
}

export type RunOptions = {
  test: TestContext;
  chainSpec: ChainSpec;
  path: string;
  accumulateSequentially: boolean;
};

export type RunFunction<T, V> = (test: T, options: RunOptions, variant: V) => Promise<void>;

export type Runner<T, V> = {
  path: string;
  parsers: testFile.Kind<T>[];
  run: RunFunction<T, V>;
  variants: V[];
  chainSpecs: ChainSpec[];
};

export namespace testFile {
  export const json = ".json";
  export type json = typeof json;
  export const bin = ".bin";
  export type bin = typeof bin;

  export type Kind<T> =
    | {
        kind: json;
        fromJson: FromJson<T>;
      }
    | {
        kind: bin;
        codec: Decode<T>;
      };

  export type Content =
    | {
        kind: json;
        content: unknown;
      }
    | {
        kind: bin;
        content: Uint8Array;
      };
}

const PVM_OPTION = "pvm";
const ACCUMULATE_SEQUENTIALLY_OPTION = "accumulate-sequentially";
const HELP_OPTION = "help";
export const HELP_MESSAGE = `
Usage: test-runner [options] [files...]

Options:
  --pvm <value>                Select PVM backend(s). Comma-separated list.
                               Available: ${ALL_PVMS.join(", ")}
                               Default: all PVMs

  --accumulate-sequentially    Run accumulation sequentially instead of in parallel.
```
