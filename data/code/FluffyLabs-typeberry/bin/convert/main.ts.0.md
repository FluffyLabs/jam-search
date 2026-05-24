---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/main.ts#L1-L134'
title: bin/convert/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 2c89b35771196e9034fa16cccf3c71d312d4ee962bcec072bfb523173dc61cd2
language: typescript
---
`bin/convert/main.ts` (lines 1–134)

```typescript
// biome-ignore-all lint/suspicious/noConsole: bin file

import "json-bigint-patch";
import fs from "node:fs";
import { start as startRepl } from "node:repl";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Decoder, Encoder, ObjectView } from "@typeberry/codec";
import { HashDictionary } from "@typeberry/collections";
import { type ChainSpec, fullChainSpec, tinyChainSpec } from "@typeberry/config";
import { Blake2b } from "@typeberry/hash";
import { parseFromJson } from "@typeberry/json-parser";
import { assertNever, inspect } from "@typeberry/utils";
import { type Arguments, KnownChainSpec, OutputFormat } from "./args.js";
import type { SupportedType } from "./types.js";

export async function main(args: Arguments, withRelPath: (v: string) => string) {
  const { processed, type, spec } = await loadAndProcessDataFile(
    args.inputPath,
    withRelPath,
    args.flavor,
    args.type,
    args.process,
  );
  dumpOutput(spec, processed, type, args.outputFormat, args, withRelPath);
  return;
}

function getChainSpec(chainSpec: KnownChainSpec) {
  if (chainSpec === KnownChainSpec.Full) {
    return fullChainSpec;
  }
  if (chainSpec === KnownChainSpec.Tiny) {
    return tinyChainSpec;
  }
  assertNever(chainSpec);
}

function loadInputFile(
  file: string | undefined,
  withRelPath: (v: string) => string,
):
  | {
      type: "blob";
      data: BytesBlob;
    }
  | {
      type: "json";
      data: unknown;
    } {
  if (file === undefined) {
    throw new Error("Missing input file!");
  }

  if (file.endsWith(".bin")) {
    const fileContent = fs.readFileSync(withRelPath(file));

    return {
      type: "blob",
      data: BytesBlob.blobFrom(fileContent),
    };
  }

  const fileContent = fs.readFileSync(withRelPath(file), "utf8").trim();
  if (file.endsWith(".hex")) {
    return {
      type: "blob",
      data: BytesBlob.parseBlob(fileContent),
    };
  }

  if (file.endsWith(".json")) {
    return {
      type: "json",
      data: JSON.parse(fileContent),
    };
  }

  throw new Error("Input file format unsupported.");
}

function dumpOutput(
  spec: ChainSpec,
  data: unknown,
  type: SupportedType,
  outputFormat: OutputFormat,
  args: Arguments,
  withRelPath: (path: string) => string,
) {
  const { destination } = args;
  const dump =
    destination !== null
      ? (v: string | Uint8Array) => fs.writeFileSync(withRelPath(destination), v)
      : (v: string | Uint8Array) => console.info(v);

  switch (outputFormat) {
    case OutputFormat.Print: {
      dump(`${inspect(data)}`);
      return;
    }
    case OutputFormat.Hex: {
      if (type.encode === undefined) {
        throw new Error(`${type.name} does not support encoding to JAM codec.`);
      }
      const encoder = typeof type.encode === "function" ? type.encode(spec) : type.encode;
      const encoded = Encoder.encodeObject(encoder, data, spec);
      dump(`${encoded}`);
      return;
    }
    case OutputFormat.Bin: {
      if (destination === null) {
        throw new Error(`${OutputFormat.Bin} requires destination file.`);
      }
      if (type.encode === undefined) {
        throw new Error(`${type.name} does not support encoding to JAM codec.`);
      }
      const encoder = typeof type.encode === "function" ? type.encode(spec) : type.encode;
      const encoded = Encoder.encodeObject(encoder, data, spec);
      dump(encoded.raw);
      return;
    }
    case OutputFormat.Json: {
      // TODO [ToDr] this will probably not work for all cases,
      // but for now may be good enough.
      dump(toJson(data));
      return;
    }
    case OutputFormat.Repl: {
      console.info("\nStarting JavaScript REPL with converted data...");
      console.info("📦 Data type:", type.name);
      console.info("💡 Your data is available in the 'data' variable");
      console.info("🔍 Try: data, inspect(data), toJson(data)");
      console.info("❓ Type .help for REPL commands or .exit to quit\n");

      const replServer = startRepl({
```
