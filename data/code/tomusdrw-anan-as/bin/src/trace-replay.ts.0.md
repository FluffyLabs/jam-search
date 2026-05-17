---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/trace-replay.ts#L1-L119'
title: bin/src/trace-replay.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 180c7ffa396ed3c73f635eb2dc74e04cc561f07a62218d65edc576bfd6a43d62
language: typescript
---
`bin/src/trace-replay.ts` (lines 1–119)

```typescript
import { readFileSync } from "node:fs";
import * as defaultPvm from "../../build/release.js";
import { LOG_HOST_CALL_INDEX, printLogHostCall } from "./log-host-call.js";
import {
  buildInitialChunks,
  buildInitialPages,
  encodeRegistersFromDump,
  extractSpiArgs,
  isSpiTrace,
  parseTrace,
  STATUS,
  statusToTermination,
  TraceSummary,
} from "./trace-parse.js";
import { ConsoleTracer, Tracer } from "./tracer.js";
import { hexEncode } from "./utils.js";

export type PvmApi = {
  HasMetadata: typeof defaultPvm.HasMetadata;
  InputKind: typeof defaultPvm.InputKind;
  prepareProgram: typeof defaultPvm.prepareProgram;
  runProgram: typeof defaultPvm.runProgram;
  pvmStart: typeof defaultPvm.pvmStart;
  pvmDestroy: typeof defaultPvm.pvmDestroy;
  pvmResume: typeof defaultPvm.pvmResume;
  pvmReadMemory: typeof defaultPvm.pvmReadMemory;
  pvmWriteMemory: typeof defaultPvm.pvmWriteMemory;
  pvmSetRegisters: typeof defaultPvm.pvmSetRegisters;
};

type ReplayOptions = {
  logs: boolean;
  hasMetadata: defaultPvm.HasMetadata;
  verify: boolean;
  logHostCall?: boolean;
  tracer?: Tracer;
  useBlockGas?: boolean;
  pvm?: PvmApi;
};

export function replayTraceFile(filePath: string, options: ReplayOptions): TraceSummary {
  const pvm = options.pvm ?? defaultPvm;
  const { prepareProgram, pvmStart, pvmDestroy, pvmResume, pvmReadMemory, pvmWriteMemory, pvmSetRegisters, InputKind } =
    pvm;

  const input = readFileSync(filePath, "utf8");
  const trace = parseTrace(input);

  const { program, initialMemWrites, start, ecalliEntries, termination } = trace;

  const hasMetadata = options.hasMetadata;
  const useSpi = isSpiTrace(start, initialMemWrites);
  const programInput = Array.from(program);
  const spiArgs = Array.from(extractSpiArgs(start, initialMemWrites));

  const preallocateMemoryPages = 128;
  const useBlockGas = options.useBlockGas ?? false;
  const preparedProgram = useSpi
    ? prepareProgram(InputKind.SPI, hasMetadata, programInput, [], [], [], spiArgs, preallocateMemoryPages, useBlockGas)
    : prepareProgram(
        InputKind.Generic,
        hasMetadata,
        programInput,
        encodeRegistersFromDump(start.registers),
        buildInitialPages(initialMemWrites),
        buildInitialChunks(initialMemWrites),
        [],
        preallocateMemoryPages,
        useBlockGas,
      );

  const id = pvmStart(preparedProgram);
  const initialEcalliCount = ecalliEntries.length;
  const tracer = options.tracer ?? new ConsoleTracer();

  try {
    let gas = start.gas;
    let pc = start.pc;

    // Print prelude: program, initial memwrites, start
    tracer.program(program);
    for (const write of initialMemWrites) {
      tracer.memwrite(write.address, write.data);
    }
    tracer.start(pc, gas, start.registers);

    for (;;) {
      const pause = pvmResume(id, gas, pc, options.logs);

      if (!pause) {
        throw new Error("pvmResume returned null");
      }

      if (pause.status === STATUS.HOST) {
        const expectedEcalli = ecalliEntries.shift();
        if (!expectedEcalli) {
          throw new Error("Unexpected host call");
        }

        // Print ecalli line
        tracer.ecalli(expectedEcalli.index, pause.pc, pause.gas, pause.registers);

        // Print log message for JIP-1 log host call
        if (pause.exitCode === LOG_HOST_CALL_INDEX && options.logHostCall) {
          printLogHostCall(id, pause.registers);
        }

        if (options.verify) {
          assertEq(pause.exitCode, expectedEcalli.index, "ecalli index");
          assertEq(pause.pc, expectedEcalli.pc, "ecalli pc");
          assertEq(pause.gas, expectedEcalli.gas, "ecalli gas");
          assertRegisters(pause.registers, expectedEcalli.registers);
        }

        // Print and verify memreads
        for (const read of expectedEcalli.memReads) {
          tracer.memread(read.address, read.data);
          if (options.verify) {
            const actualData = pvmReadMemory(id, read.address, read.data.length);
```
