---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/args.ts#L1-L148'
title: bin/convert/args.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 3
content_sha: 42acc6d141cf786f4f775c4a01a9df62be819840f178b5a8d8d2062f8b2e78d5
language: typescript
---
`bin/convert/args.ts` (lines 1–148)

```typescript
import { version } from "@typeberry/utils";
import minimist from "minimist";
import { SUPPORTED_TYPES, type SupportedType } from "./types.js";

export const HELP = `
@typeberry/convert ${version} by Fluffy Labs.

Usage:
  @typeberry/convert [options] <bin-hex-or-json-input-file> <type> [process] [output-format] [output-file]

Attempts to read provided input file as 'type' and output in requested 'output-format'.
For some 'type's it's additionally possible to process the data before outputting it.
The input type is detected from file extension ('.bin', '.hex' or '.json').

Example usage:
  @typeberry/convert ./genesis-header.json header to-hex
  @typeberry/convert ./state-snapshot.json state-dump as-entries to-json
  @typeberry/convert ./state-snapshot.json stf-vector as-fuzz-message to-bin msg0.bin

Options:
  --flavor    - chain spec flavor, either 'full' or 'tiny'.
                [default: tiny]

Output formats:
  to-print       - Print the object to the console
  to-json        - JSON format (when supported)
  to-hex         - JAM-codec hex-encoded string (when supported)
  to-bin         - JAM-codec binary data (when supported)
  to-repl        - Start a JavaScript REPL with the data loaded into a variable

Input types:
${SUPPORTED_TYPES.map((x) => `  ${x.name}`).join("\n")}

Processing: ${SUPPORTED_TYPES.filter((x) => x.process !== undefined).map(
  (x) => `
  ${x.name}:
    ${x.process?.options.join(", ")}`,
)}
`;

/** Chain spec chooser. */
export enum KnownChainSpec {
  /** Tiny chain spec. */
  Tiny = "tiny",
  /** Full chain spec. */
  Full = "full",
}

export type Arguments = {
  flavor: KnownChainSpec;
  process: string;
  type: SupportedType;
  inputPath: string;
  outputFormat: OutputFormat;
  destination: string | null;
};

export enum OutputFormat {
  Print = "to-print",
  Json = "to-json",
  Hex = "to-hex",
  Bin = "to-bin",
  Repl = "to-repl",
}

export function parseArgs(cliInput: string[], withRelPath: (v: string) => string): Arguments {
  const args = minimist(cliInput);
  const chainSpec = parseOption(
    args,
    "flavor",
    (flavor) => {
      switch (flavor) {
        case KnownChainSpec.Tiny:
          return KnownChainSpec.Tiny;
        case KnownChainSpec.Full:
          return KnownChainSpec.Full;
        default:
          throw Error(`unknown flavor: ${flavor}`);
      }
    },
    KnownChainSpec.Tiny,
  );
  const input = args._.shift();
  if (input === undefined) {
    throw new Error("Missing input file!");
  }
  const type = parseType(args._.shift());
  const maybeProcess = args._.shift();
  const maybeOutputFormat = args._.shift();
  const maybeDestination = args._.shift();

  assertNoMoreArgs(args);

  const { process, format, destination } = getProcessFormatAndDestination(
    type,
    maybeProcess,
    maybeOutputFormat,
    maybeDestination,
  );

  return {
    flavor: chainSpec.flavor,
    type,
    process,
    inputPath: withRelPath(input),
    outputFormat: format,
    destination,
  };
}

function parseType(type?: string) {
  if (type === undefined) {
    throw new Error("Missing input type.");
  }

  const meta = SUPPORTED_TYPES.find((x) => x.name === type);
  if (meta === undefined) {
    throw new Error(`Unsupported input type: '${type}'.`);
  }

  return meta;
}

function parseOutputFormat(output?: string): OutputFormat {
  if (output === undefined) {
    return OutputFormat.Print;
  }
  switch (output) {
    case OutputFormat.Print:
      return OutputFormat.Print;
    case OutputFormat.Hex:
      return OutputFormat.Hex;
    case OutputFormat.Json:
      return OutputFormat.Json;
    case OutputFormat.Repl:
      return OutputFormat.Repl;
    case OutputFormat.Bin:
      return OutputFormat.Bin;
    default:
      throw new Error(`Invalid output format: '${output}'.`);
  }
}

function parseProcess(processOptions: readonly string[], maybeProcess?: string): string | null {
  if (maybeProcess === undefined) {
    return null;
  }

```
