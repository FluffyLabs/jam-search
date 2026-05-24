---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/index.ts#L112-L233'
title: bin/index.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-20T20:20:54Z'
last_modified: '2026-05-20T20:20:54Z'
chunk_index: 1
chunk_total: 5
content_sha: 4846afe3258f7449f30d723b006b08dd9276076a288d19a3cbd1a517f04cde88
language: typescript
---
`bin/index.ts` (lines 112–233)

```typescript
  if (dotIndex === -1) {
    console.error(`Error: File '${file}' has no extension.`);
    console.error("Supported extensions: .jam, .pvm, .spi, .bin");
    process.exit(1);
  }
  const ext = file.slice(dotIndex);
  if (!validExtensions.includes(ext)) {
    console.error(`Error: Invalid file extension '${ext}' for disassemble command.`);
    console.error("Supported extensions: .jam, .pvm, .spi, .bin");
    process.exit(1);
  }

  const kind = values.spi ? InputKind.SPI : InputKind.Generic;
  const hasMetadata = values["no-metadata"] ? HasMetadata.No : HasMetadata.Yes;

  const f = readFileSync(file);
  const name = kind === InputKind.Generic ? "generic PVM" : "JAM SPI";
  console.log(`🤖 Assembly of ${file} (as ${name})`);
  console.log(disassemble(Array.from(f), kind, hasMetadata));
}

function handleRun(args: string[]) {
  const { values, positionals: files } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      spi: { type: "boolean", default: false },
      "no-logs": { type: "boolean", default: false },
      "no-metadata": { type: "boolean", default: false },
      "no-log-host-call": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      pc: { type: "string" },
      gas: { type: "string" },
      regs: { type: "string" },
      pages: { type: "string" },
      mem: { type: "string" },
      dump: { type: "string" },
    },
  });

  if (values.help) {
    console.log(HELP_TEXT);
    return;
  }

  if (files.length === 0) {
    console.error("Error: No file provided for run command.");
    console.error(
      "Usage: anan-as run [--spi] [--no-logs] [--no-metadata] [--pc <number>] [--gas <number>] <file.jam> [spi-args.bin]",
    );
    process.exit(1);
  }

  const kind = values.spi ? InputKind.SPI : InputKind.Generic;

  let programFile: string;
  let spiArgsStr: string | undefined;

  if (kind === InputKind.SPI) {
    // For SPI programs, expect: <program.spi> [spi-args.bin or hex]
    if (files.length > 2) {
      console.error("Error: Too many arguments for SPI run command.");
      console.error(
        "Usage: anan-as run --spi [--no-logs] [--no-metadata] [--pc <number>] [--gas <number>] <program.spi> [spi-args.bin or hex]",
      );
      process.exit(1);
    }
    programFile = files[0];
    spiArgsStr = files[1]; // optional
  } else {
    // For generic programs, expect exactly one file
    if (files.length > 1) {
      console.error("Error: Only one file can be run at a time.");
      console.error("Usage: anan-as run [--no-logs] [--no-metadata] [--pc <number>] [--gas <number>] <file.jam>");
      process.exit(1);
    }
    programFile = files[0];
  }

  // Validate SPI args file if provided
  const spiArgs = parseSpiArgs(spiArgsStr);

  const logs = !values["no-logs"];
  const logHostCall = !values["no-log-host-call"];
  const hasMetadata = values["no-metadata"] ? HasMetadata.No : HasMetadata.Yes;

  // Parse and validate PC and gas options
  const initialPc = parsePc(values.pc);
  const initialGas = parseGas(values.gas);
  const initialRegisters = parseRegs(values.regs);
  const initialPages = parsePages(values.pages);
  const initialMemory = parseMem(values.mem);
  const dumpRegions = parseDump(values.dump);

  const programCode = Array.from(readFileSync(programFile));
  const name = kind === InputKind.Generic ? "generic PVM" : "JAM SPI";
  console.log(`🚀 Running ${programFile} (as ${name})`);

  try {
    const preallocateMemoryPages = 128;
    const useBlockGas = true;
    const program = prepareProgram(
      kind,
      hasMetadata,
      programCode,
      initialRegisters,
      initialPages,
      initialMemory,
      spiArgs,
      preallocateMemoryPages,
      useBlockGas,
    );
    const id = pvmStart(program);
    let gas = initialGas;
    let pc = initialPc;

    for (;;) {
      const pause = pvmResume(id, gas, pc, logs);
      if (!pause) {
        throw new Error("pvmResume returned null");
      }

```
