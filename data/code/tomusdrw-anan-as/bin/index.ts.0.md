---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/index.ts#L1-L117'
title: bin/index.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 3ef3f73ebc21267fa183609e44b5e554fded46c1a6d357a3f1ca3202e3db2e15
language: typescript
---
`bin/index.ts` (lines 1–117)

```typescript
#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import {
  disassemble,
  HasMetadata,
  InputKind,
  prepareProgram,
  pvmDestroy,
  pvmReadMemory,
  pvmResume,
  pvmSetRegisters,
  pvmStart,
} from "../build/release.js";
import { LOG_GAS_COST, LOG_HOST_CALL_INDEX, printLogHostCall, WHAT } from "./src/log-host-call.js";
import { STATUS } from "./src/trace-parse.js";
import { replayTraceFile } from "./src/trace-replay.js";
import { hexDecode, hexEncode } from "./src/utils.js";

// Page access modes (matches assembly/memory-page.ts Access enum)
const ACCESS_READ = 1;
const ACCESS_WRITE = 2;

const HELP_TEXT = `Usage:
  anan-as disassemble [--spi] [--no-metadata] <file.(jam|pvm|spi|bin)>
  anan-as run [--spi] [--no-logs] [--no-metadata] [--no-log-host-call] [--pc <number>] [--gas <number>] [--regs <r0,r1,...,r12>] <file.jam> [spi-args.bin or hex]
  anan-as replay-trace [--no-metadata] [--no-verify] [--no-logs] [--no-log-host-call] <trace.log>

Commands:
  disassemble  Disassemble PVM bytecode to assembly
  run          Execute PVM bytecode
  replay-trace  Re-execute a ecalli IO trace

Flags:
  --spi               Treat input as JAM SPI format
  --no-metadata       Input does not contain metadata
  --no-logs           Disable execution logs
  --no-log-host-call  Disable built-in handling of JIP-1 log host call (ecalli 100)
  --no-verify         Skip verification against trace data (replay-trace only)
  --pc <number>       Set initial program counter (default: 0)
  --gas <number>      Set initial gas amount (default: 10_000)
  --regs <values>     Set initial registers (comma-separated, 13 values: r0,r1,...,r12; supports decimal and 0x hex)
  --pages <specs>     Add memory pages (semicolon-separated: "addr:size;addr:size:ro"; append ":r" or ":ro" for read-only)
  --mem <specs>       Initialize memory (semicolon-separated: "addr:hex_bytes;addr:hex_bytes")
  --dump <specs>      Dump memory after execution (semicolon-separated: "addr:len;addr:len")
  --help, -h          Show this help message`;

main();

function main() {
  const args = process.argv.slice(2);

  // Handle global help flags
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(HELP_TEXT);
    return;
  }

  const subCommand = args[0];

  switch (subCommand) {
    case "disassemble":
      handleDisassemble(args.slice(1));
      break;
    case "run":
      handleRun(args.slice(1));
      break;
    case "replay-trace":
      handleReplayTrace(args.slice(1));
      break;
    default:
      console.error(`Error: Unknown sub-command '${subCommand}'`);
      console.error("");
      console.error(HELP_TEXT);
      process.exit(1);
  }
}

function handleDisassemble(args: string[]) {
  const { values, positionals: files } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      spi: { type: "boolean", default: false },
      "no-metadata": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  if (values.help) {
    console.log(HELP_TEXT);
    return;
  }

  if (files.length === 0) {
    console.error("Error: No file provided for disassemble command.");
    console.error("Usage: anan-as disassemble [--spi] [--no-metadata] <file.(jam|pvm|spi|bin)>");
    process.exit(1);
  }
  if (files.length > 1) {
    console.error("Error: Only one file can be disassembled at a time.");
    console.error("Usage: anan-as disassemble [--spi] [--no-metadata] <file.(jam|pvm|spi|bin)>");
    process.exit(1);
  }

  const file = files[0];

  // Validate file extension for disassemble command
  const validExtensions = [".jam", ".pvm", ".spi", ".bin"];
  const dotIndex = file.lastIndexOf(".");
  if (dotIndex === -1) {
    console.error(`Error: File '${file}' has no extension.`);
    console.error("Supported extensions: .jam, .pvm, .spi, .bin");
    process.exit(1);
  }
  const ext = file.slice(dotIndex);
```
